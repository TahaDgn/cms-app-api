import { IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AccessRequestResponse,
  GetUserResponse,
  NotificationType,
  UserCreationSagaPayload,
  UserCreationSagaResult,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

interface UserCreationContext {
  payload: UserCreationSagaPayload;
  getUserResponse?: GetUserResponse;
  accessRequestResponse?: AccessRequestResponse;
}

export async function userCreationSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserCreationSagaPayload,
  metadata: Metadata,
): Promise<UserCreationSagaResult> {
  const context: UserCreationContext = {
    payload,
    getUserResponse: undefined,
    accessRequestResponse: undefined,
  };

  const steps: SagaStep<UserCreationContext>[] = [
    new SagaStep<UserCreationContext>(
      'CreateUserUnderTenant',
      async (stepContext) => {
        const {
          payload: { email, name, type },
        } = stepContext;

        const response = await identityGrpcClient.createUser(
          {
            name,
            email,
            type,
          },
          metadata,
        );

        stepContext.getUserResponse = response;
      },
      async (stepContext) => {
        const { getUserResponse: userWithTenantResponse } = stepContext;

        if (!userWithTenantResponse) {
          return;
        }

        const {
          user: { id },
        } = userWithTenantResponse;

        await identityGrpcClient.deleteUser(
          {
            id,
          },
          metadata,
        );
      },
    ),
    new SagaStep<UserCreationContext>(
      'CreateAccessLink',
      async (stepContext) => {
        const {
          getUserResponse: {
            user: { email, tenantId },
          },
        } = stepContext;

        const response = await identityGrpcClient.createAccessRequestLink(
          {
            email,
            tenantId,
          },
          metadata,
        );

        stepContext.accessRequestResponse = response;
      },
      async (stepContext) => {
        const { accessRequestResponse } = stepContext;

        if (!accessRequestResponse) {
          return;
        }

        const { accessCode } = accessRequestResponse;

        await identityGrpcClient.removeAccessCode({ accessCode }, metadata);
      },
    ),
    new SagaStep<UserCreationContext>(
      'SendMail',
      async (stepContext) => {
        const {
          accessRequestResponse: {
            accessUrl,
            userType,
            userName,
            tenantIdentifier,
            tenantName,
          },
          getUserResponse: {
            user: { email },
          },
        } = stepContext;

        await rabbitMqAdapter.publish(NOTIFICATION_QUEUE, {
          type: NotificationType.REGISTRATION_LINK,
          email,
          payload: {
            userName,
            tenantName,
            userType,
            accessUrl,
            tenantIdentifier,
          },
        });
      },
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.getUserResponse;
}
