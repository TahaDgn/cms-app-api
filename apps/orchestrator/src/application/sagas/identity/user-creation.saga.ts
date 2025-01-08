import { IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AccessRequestResponse,
  UserWithTenantResponse,
  NotificationType,
  UserCreationSagaPayload,
  UserCreationSagaResult,
} from 'libs/interfaces';

interface UserCreationContext {
  payload: UserCreationSagaPayload;
  UserWithTenantResponse?: UserWithTenantResponse;
  accessRequestResponse?: AccessRequestResponse;
}

export async function userCreationSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserCreationSagaPayload,
): Promise<UserCreationSagaResult> {
  const context: UserCreationContext = {
    payload,
    UserWithTenantResponse: undefined,
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

        stepContext.UserWithTenantResponse = response;
      },
      async (stepContext) => {
        const { UserWithTenantResponse } = stepContext;

        if (!UserWithTenantResponse) {
          return;
        }

        const { id, tenantId } = UserWithTenantResponse;

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
          UserWithTenantResponse: { email, tenantId },
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
          UserWithTenantResponse: { email },
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

  return context.UserWithTenantResponse;
}
