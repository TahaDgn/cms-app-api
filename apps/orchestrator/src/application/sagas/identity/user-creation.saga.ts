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

interface UserCreationContext {
  payload: UserCreationSagaPayload;
  userWithTenantResponse?: GetUserResponse;
  accessRequestResponse?: AccessRequestResponse;
}

export async function userCreationSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserCreationSagaPayload,
): Promise<UserCreationSagaResult> {
  const context: UserCreationContext = {
    payload,
    userWithTenantResponse: undefined,
    accessRequestResponse: undefined,
  };

  const steps: SagaStep<UserCreationContext>[] = [
    new SagaStep<UserCreationContext>(
      'CreateUserUnderTenant',
      async (stepContext) => {
        const {
          payload: { email, name, tenantId, type },
        } = stepContext;

        const response = await identityGrpcClient.createUser({
          tenantId,
          name,
          email,
          type,
        });

        stepContext.userWithTenantResponse = response;
      },
      async (stepContext) => {
        const { userWithTenantResponse } = stepContext;

        if (!userWithTenantResponse) {
          return;
        }

        const { id, tenantId } = userWithTenantResponse;

        await identityGrpcClient.deleteUser({
          id,
          tenantId,
        });
      },
    ),
    new SagaStep<UserCreationContext>(
      'CreateAccessLink',
      async (stepContext) => {
        const {
          userWithTenantResponse: { email, tenantId },
        } = stepContext;

        const response = await identityGrpcClient.createAccessRequestLink({
          email,
          tenantId,
        });

        stepContext.accessRequestResponse = response;
      },
      async (stepContext) => {
        const { accessRequestResponse } = stepContext;

        if (!accessRequestResponse) {
          return;
        }

        const { accessCode } = accessRequestResponse;

        await identityGrpcClient.removeAccessCode({ accessCode });
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
          userWithTenantResponse: { email },
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

  return context.userWithTenantResponse;
}
