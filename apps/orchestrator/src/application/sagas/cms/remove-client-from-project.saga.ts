import { CmsGrpcClient, IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  UserWithTenantResponse,
  AddOrRemoveClientFromProjectResponse,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';

interface RemoveClientFromProjectContext {
  payload: RemoveClientFromProjectSagaPayload;
  addOrRemoveClientFromProjectResponse?: AddOrRemoveClientFromProjectResponse;
  userWithTenantResponse?: UserWithTenantResponse;
}

export async function runRemoveClientFromProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: RemoveClientFromProjectSagaPayload,
): Promise<RemoveClientFromProjectSagaResult> {
  const context: RemoveClientFromProjectContext = {
    payload,
    addOrRemoveClientFromProjectResponse: undefined,
    userWithTenantResponse: undefined,
  };

  const steps: SagaStep<RemoveClientFromProjectContext>[] = [
    new SagaStep<RemoveClientFromProjectContext>(
      'RemoveClientFromProject',
      async (stepContext) => {
        const {
          payload: {
            project: { id: projectId, tenantId },
            user: { id: clientId },
          },
        } = stepContext;

        const response = await cmsGrpcClient.removeClientFromProject({
          clientId,
          projectId,
          tenantId,
        });

        stepContext.addOrRemoveClientFromProjectResponse = response;
      },
      async (stepContext) => {
        const {
          payload: {
            project: { id: projectId, tenantId },
            user: { id: clientId },
          },
        } = stepContext;

        await cmsGrpcClient.addClientToProject({
          clientId,
          tenantId,
          projectId,
        });
      },
    ),
    new SagaStep<RemoveClientFromProjectContext>(
      'GetUser',
      async (stepContext) => {
        const {
          payload: {
            project: { tenantId },
            user: { id },
          },
        } = stepContext;

        const response = await identityGrpcClient.getUser({
          id,
          tenantId,
        });

        stepContext.userWithTenantResponse = response;
      },
      async () => {},
    ),
    new SagaStep<RemoveClientFromProjectContext>(
      'SendMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);
}
