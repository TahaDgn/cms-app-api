import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  GetUserResponse,
  UserDeletionSagaPayload,
  UserDeletionSagaResult,
  NotificationType,
  ListProjectsResponse,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';
import { NOTIFICATION_QUEUE } from 'libs/constants';

interface UserDeletionContext {
  payload: UserDeletionSagaPayload;
  getUserResponse?: GetUserResponse;
  listProjectsResponse?: ListProjectsResponse;
  listProjectsResponseAfterClientsRemoval?: ListProjectsResponse;
}

export async function userDeletionSaga(
  identityGrpcClient: IdentityGrpcClient,
  cmsGrpcClient: CmsGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserDeletionSagaPayload,
): Promise<UserDeletionSagaResult> {
  const context: UserDeletionContext = {
    payload,
    getUserResponse: undefined,
    listProjectsResponse: undefined,
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

        stepContext.getUserResponse = response;
      },
      async (stepContext) => {
        const { getUserResponse: deletedUserResponse } = stepContext;
        if (!deletedUserResponse) {
          return;
        }

        const { email, name, tenantId, type } = deletedUserResponse;

        await identityGrpcClient.createUser({
          email,
          name,
          tenantId,
          type,
        });
      },
    ),
    new SagaStep<UserDeletionContext>(
      'ListProjects',
      async (stepContext) => {
        const {
          payload: { id, tenantId },
        } = stepContext;

        const response = await cmsGrpcClient.listProjects({
          where: {
            tenantId,
            clientUserIds: {
              has: id,
            },
          },
        });

        stepContext.listProjectsResponse = response;
      },
      async () => {
        // No Compensation
      },
    ),
    new SagaStep<UserDeletionContext>(
      'RemoveClientsFromAllProjects',
      async (stepContext) => {
        const {
          getUserResponse: { id: clientId, type, tenantId },
          listProjectsResponse: { projects },
        } = stepContext;

        if (type !== UserType.CLIENT) {
          return;
        }

        if (projects.length < 1) {
          return;
        }

        const projectIds = projects.map((project) => project.id);

        const response = await cmsGrpcClient.removeClientsFromProjects({
          ids: projectIds,
          clientUserIds: [clientId],
          tenantId,
        });

        stepContext.listProjectsResponseAfterClientsRemoval = response;
      },
      async (stepContext) => {
        const {
          listProjectsResponseAfterClientsRemoval,
          getUserResponse: { id: clientId, tenantId },
        } = stepContext;

        if (!listProjectsResponseAfterClientsRemoval) {
          return;
        }

        const { projects } = listProjectsResponseAfterClientsRemoval;

        if (projects.length < 1) {
          return;
        }

        const ids = projects.map((project) => project.id);

        await cmsGrpcClient.addClientsToProjects({
          ids,
          tenantId,
          clientUserIds: [clientId],
        });
      },
    ),
    new SagaStep<UserDeletionContext>(
      'SendMail',
      async (stepContext) => {
        const {
          getUserResponse: {
            name: userName,
            type: userType,
            email,
            tenant: { name: tenantName, identifier: tenantIdentifier },
          },
        } = stepContext;

        await rabbitMqAdapter.publish(NOTIFICATION_QUEUE, {
          type: NotificationType.USER_DELETED,
          email,
          payload: {
            userName,
            tenantName,
            userType,
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
