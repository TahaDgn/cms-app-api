import { IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  UserRegistrationSagaPayload,
  UserRegistrationSagaResult,
} from 'libs/interfaces/orchestrator.interface';
import {
  AccessRequestResponse,
  CreateTenantAndUserResponse,
  NotificationType,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

interface UserRegistrationContext {
  payload: UserRegistrationSagaPayload;
  createTenantAndUserResponse?: CreateTenantAndUserResponse;
  accessRequestResponse?: AccessRequestResponse;
}

export async function userRegistrationSaga(
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserRegistrationSagaPayload,
  metadata: Metadata,
): Promise<UserRegistrationSagaResult> {
  const context: UserRegistrationContext = {
    payload,
    createTenantAndUserResponse: undefined,
    accessRequestResponse: undefined,
  };

  const steps: SagaStep<UserRegistrationContext>[] = [
    new SagaStep<UserRegistrationContext>(
      'CreateTenantAndUser',
      async (stepContext) => {
        const {
          payload: { tenant, user },
        } = stepContext;

        const response = await identityGrpcClient.createTenantWithOwner(
          {
            tenant,
            user,
          },
          metadata,
        );

        stepContext.createTenantAndUserResponse = response;
      },
      async (stepContext) => {
        const { createTenantAndUserResponse } = stepContext;

        if (!createTenantAndUserResponse) {
          return;
        }

        const {
          tenant: { id },
        } = createTenantAndUserResponse;

        await identityGrpcClient.deleteTenant({ id }, metadata);
      },
    ),
    new SagaStep<UserRegistrationContext>(
      'CreateAccessLink',
      async (stepContext) => {
        const {
          createTenantAndUserResponse: {
            user: { email },
            tenant: { id: tenantId },
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
    new SagaStep<UserRegistrationContext>(
      'SendNotificationMail',
      async (stepContext) => {
        const {
          createTenantAndUserResponse: {
            user: { email },
          },
          accessRequestResponse: {
            accessUrl,
            tenantName,
            userName,
            userType,
            tenantIdentifier,
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
}
