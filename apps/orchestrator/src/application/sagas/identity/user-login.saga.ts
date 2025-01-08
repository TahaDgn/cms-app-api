import { IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  UserLoginSagaPayload,
  UserLoginSagaResult,
} from 'libs/interfaces/orchestrator.interface';
import { AccessRequestResponse, NotificationType } from 'libs/interfaces';

interface UserLoginContext {
  payload: UserLoginSagaPayload;
  accessRequestResponse?: AccessRequestResponse;
}

export async function userLoginSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserLoginSagaPayload,
): Promise<UserLoginSagaResult> {
  const context: UserLoginContext = { payload };

  const steps: SagaStep<UserLoginContext>[] = [
    new SagaStep<UserLoginContext>(
      'CreateAccessLink',
      async (stepContext) => {
        const {
          payload: { email, tenantIdentifier },
        } = stepContext;

        const response = await identityGrpcClient.createAccessRequestLink({
          email,
          tenantIdentifier,
        });

        stepContext.accessRequestResponse = response;
      },
      async (stepContext) => {
        const { accessRequestResponse } = stepContext;

        if (!accessRequestResponse) {
          return;
        }

        const { accessCode } = accessRequestResponse;

        identityGrpcClient.removeAccessCode({
          accessCode,
        });
      },
    ),
    new SagaStep<UserLoginContext>(
      'SendNotificationMail',
      async (stepContext) => {
        const {
          accessRequestResponse: { accessUrl, userName, tenantName, userType },
          payload: { email },
        } = stepContext;

        await rabbitMqAdapter.publish(NOTIFICATION_QUEUE, {
          type: NotificationType.LOGIN_LINK,
          email,
          payload: {
            userName,
            tenantName,
            userType,
            accessUrl,
          },
        });
      },
      async () => {},
    ),
  ];

  await runSaga(steps, context);
}
