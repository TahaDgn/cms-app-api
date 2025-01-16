import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  GetProjectResponse,
  ListUsersResponse,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';

interface RemoveClientFromProjectContext {
  payload: RemoveClientFromProjectSagaPayload;
  getProjectResponse?: GetProjectResponse;
  listUsersResponse?: ListUsersResponse;
}

export async function runRemoveClientFromProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: RemoveClientFromProjectSagaPayload,
): Promise<RemoveClientFromProjectSagaResult> {
  const context: RemoveClientFromProjectContext = {
    payload,
    getProjectResponse: undefined,
    listUsersResponse: undefined,
  };

  const steps: SagaStep<RemoveClientFromProjectContext>[] = [
    new SagaStep<RemoveClientFromProjectContext>(
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
    new SagaStep<RemoveClientFromProjectContext>(
      'RemoveUsersToProject',
      async (stepContext) => {
        const {
          payload: { id, tenantId },
          listUsersResponse,
        } = stepContext;

        const clientUserIds = listUsersResponse.users.map((user) => user.id);

        const result = await cmsGrpcClient.removeClientsFromProject({
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

        await cmsGrpcClient.addClientsToProject({
          id,
          tenantId,
          clientUserIds,
        });
      },
    ),
    new SagaStep<RemoveClientFromProjectContext>(
      'SendInformationMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.getProjectResponse;
}
