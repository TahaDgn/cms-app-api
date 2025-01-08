import { IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  DeleteUserResponse,
  NotificationType,
  UserDeletionSagaPayload,
  UserDeletionSagaResult,
} from 'libs/interfaces';

interface UserDeletionContext {
  payload: UserDeletionSagaPayload;
  deleteUserResponse?: DeleteUserResponse;
}

export async function userDeletionSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserDeletionSagaPayload,
): Promise<UserDeletionSagaResult> {
  const context: UserDeletionContext = {
    payload,
    deleteUserResponse: undefined,
  };

  const steps: SagaStep<UserDeletionContext>[] = [
    new SagaStep<UserDeletionContext>(
      'DeleteUser',
      async (stepContext) => {
        const {
          payload: { id, tenantId },
        } = stepContext;

        const response = await identityGrpcClient.deleteUser({
          id,
          tenantId,
        });

        stepContext.deleteUserResponse = response;
      },
      async (stepContext) => {
        const { deleteUserResponse: deletedUserResponse } = stepContext;
        if (!deletedUserResponse) {
          return;
        }

        const { email, name, tenantId, type } = deletedUserResponse;

        await identityGrpcClient.createUser({ email, name, tenantId, type });
      },
    ),
    new SagaStep<UserDeletionContext>(
      'SendMail',
      async (stepContext) => {
        const {
          deleteUserResponse: {
            email,
            name: userName,
            type: userType,
            tenant: { name: tenantName },
          },
        } = stepContext;

        await rabbitMqAdapter.publish(NOTIFICATION_QUEUE, {
          type: NotificationType.USER_DELETED,
          email,
          payload: {
            userName,
            tenantName,
            userType,
          },
        });
      },
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.deleteUserResponse;
}
