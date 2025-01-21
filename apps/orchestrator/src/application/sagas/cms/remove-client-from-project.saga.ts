import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  ListProjectsResponse,
  ListUsersResponse,
  RemoveClientsFromProjectsSagaPayload,
  RemoveClientsFromProjectsSagaResult,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';
import { Metadata } from '@grpc/grpc-js';

interface RemoveClientFromProjectContext {
  payload: RemoveClientsFromProjectsSagaPayload;
  listProjectsResponseAfterClientsRemoval?: ListProjectsResponse;
  listUsersResponse?: ListUsersResponse;
}

export async function removeClientFromProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: RemoveClientsFromProjectsSagaPayload,
  metadata: Metadata,
): Promise<RemoveClientsFromProjectsSagaResult> {
  const context: RemoveClientFromProjectContext = {
    payload,
    listProjectsResponseAfterClientsRemoval: undefined,
    listUsersResponse: undefined,
  };

  const steps: SagaStep<RemoveClientFromProjectContext>[] = [
    new SagaStep<RemoveClientFromProjectContext>(
      'GetUsers',
      async (stepContext) => {
        const {
          payload: { clientUserIds },
        } = stepContext;

        const response = await identityGrpcClient.listUsers(
          {
            where: {
              id: { in: clientUserIds },
              type: UserType.CLIENT,
            },
            skip: 0,
            take: clientUserIds.length,
          },
          metadata,
        );

        stepContext.listUsersResponse = response;
      },
      async () => {
        // No Compensation
      },
    ),
    new SagaStep<RemoveClientFromProjectContext>(
      'RemoveClientsFromProjects',
      async (stepContext) => {
        const {
          payload: { ids },
          listUsersResponse,
        } = stepContext;

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        const response = await cmsGrpcClient.removeClientsFromProjects(
          {
            ids,
            clientUserIds,
          },
          metadata,
        );

        stepContext.listProjectsResponseAfterClientsRemoval = response;
      },
      async (stepContext) => {
        const {
          payload: { ids },
          listUsersResponse,
        } = stepContext;

        const { listProjectsResponseAfterClientsRemoval } = stepContext;

        if (!listProjectsResponseAfterClientsRemoval) {
          return;
        }

        const { projects } = listProjectsResponseAfterClientsRemoval;

        if (projects.length < 1) {
          return;
        }

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        await cmsGrpcClient.addClientsToProjects(
          {
            ids,
            clientUserIds,
          },
          metadata,
        );
      },
    ),
    new SagaStep<RemoveClientFromProjectContext>(
      'SendInformationMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.listProjectsResponseAfterClientsRemoval;
}
