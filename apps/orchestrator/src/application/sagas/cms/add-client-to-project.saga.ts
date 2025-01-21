import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AddClientsToProjectsSagaPayload,
  AddClientsToProjectsSagaResult,
  ListProjectsResponse,
  ListUsersResponse,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';
import { Metadata } from '@grpc/grpc-js';

interface AddClientToProjectContext {
  payload: AddClientsToProjectsSagaPayload;
  listUsersResponse?: ListUsersResponse;
  listProjectsResponseAfterClientsAddition?: ListProjectsResponse;
}

export async function addClientToProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: AddClientsToProjectsSagaPayload,
  metadata: Metadata,
): Promise<AddClientsToProjectsSagaResult> {
  const context: AddClientToProjectContext = {
    payload,
    listProjectsResponseAfterClientsAddition: undefined,
    listUsersResponse: undefined,
  };

  const steps: SagaStep<AddClientToProjectContext>[] = [
    new SagaStep<AddClientToProjectContext>(
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
    new SagaStep<AddClientToProjectContext>(
      'AddClientsToProjects',
      async (stepContext) => {
        const {
          payload: { ids },
          listUsersResponse,
        } = stepContext;

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        const response = await cmsGrpcClient.addClientsToProjects(
          {
            ids,
            clientUserIds,
          },
          metadata,
        );

        stepContext.listProjectsResponseAfterClientsAddition = response;
      },
      async (stepContext) => {
        const {
          payload: { ids },
          listUsersResponse,
          listProjectsResponseAfterClientsAddition,
        } = stepContext;

        if (!listProjectsResponseAfterClientsAddition) {
          return;
        }

        const { projects } = listProjectsResponseAfterClientsAddition;

        if (projects.length < 1) {
          return;
        }

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        await cmsGrpcClient.removeClientsFromProjects(
          {
            ids,
            clientUserIds,
          },
          metadata,
        );
      },
    ),
    new SagaStep<AddClientToProjectContext>(
      'SendInformationMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.listProjectsResponseAfterClientsAddition;
}
