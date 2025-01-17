import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  ListProjectsResponse,
  ListUsersResponse,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';

interface AddClientToProjectContext {
  payload: AddClientToProjectSagaPayload;
  listUsersResponse?: ListUsersResponse;
  listProjectsResponseAfterClientsAddition?: ListProjectsResponse;
}

export async function addClientToProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: AddClientToProjectSagaPayload,
): Promise<AddClientToProjectSagaResult> {
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
          payload: { tenantId, clientUserIds },
        } = stepContext;

        const response = await identityGrpcClient.listUsers({
          where: {
            tenantId,
            id: { in: clientUserIds },
            type: UserType.CLIENT,
          },
        });

        stepContext.listUsersResponse = response;
      },
      async () => {
        // No Compensation
      },
    ),
    new SagaStep<AddClientToProjectContext>(
      'AddUsersToProject',
      async (stepContext) => {
        const {
          payload: { ids, tenantId },
          listUsersResponse,
        } = stepContext;

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        const response = await cmsGrpcClient.addClientsToProjects({
          ids,
          tenantId,
          clientUserIds,
        });

        stepContext.listProjectsResponseAfterClientsAddition = response;
      },
      async (stepContext) => {
        const {
          payload: { ids, tenantId },
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

        await cmsGrpcClient.removeClientsFromProjects({
          ids,
          tenantId,
          clientUserIds,
        });
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
