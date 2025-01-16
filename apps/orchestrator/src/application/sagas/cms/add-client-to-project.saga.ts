import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  GetProjectResponse,
  ListUsersResponse,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';

interface AddClientToProjectContext {
  payload: AddClientToProjectSagaPayload;
  getProjectResponse?: GetProjectResponse;
  listUsersResponse?: ListUsersResponse;
}

export async function addClientToProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: AddClientToProjectSagaPayload,
): Promise<AddClientToProjectSagaResult> {
  const context: AddClientToProjectContext = {
    payload,
    getProjectResponse: undefined,
    listUsersResponse: undefined,
  };

  const steps: SagaStep<AddClientToProjectContext>[] = [
    new SagaStep<AddClientToProjectContext>(
      'GetUsers',
      async (stepContext) => {
        const {
          payload: { tenantId, clientUserIds },
        } = stepContext;

        const result = await identityGrpcClient.listUsers({
          where: {
            tenantId,
            id: { in: clientUserIds },
            type: UserType.CLIENT,
          },
        });

        stepContext.listUsersResponse = result;
      },
      async () => {
        // No Compensation
      },
    ),
    new SagaStep<AddClientToProjectContext>(
      'AddUsersToProject',
      async (stepContext) => {
        const {
          payload: { id, tenantId },
          listUsersResponse,
        } = stepContext;

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        const result = await cmsGrpcClient.addClientsToProject({
          id,
          tenantId,
          clientUserIds,
        });

        stepContext.getProjectResponse = result;
      },
      async (stepContext) => {
        const {
          payload: { id, tenantId },
          listUsersResponse,
        } = stepContext;

        const { getProjectResponse } = stepContext;

        if (!getProjectResponse) {
          return;
        }

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        await cmsGrpcClient.removeClientsFromProject({
          id,
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

  return context.getProjectResponse;
}
