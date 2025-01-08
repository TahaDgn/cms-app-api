import { CmsGrpcClient, IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  UserWithTenantResponse,
  AddOrRemoveClientFromProjectResponse,
} from 'libs/interfaces';

interface AddClientToProjectContext {
  payload: AddClientToProjectSagaPayload;
  userWithTenantResponse?: UserWithTenantResponse;
  addOrRemoveClientFromProjectResponse?: AddOrRemoveClientFromProjectResponse;
}

export async function addClientToProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: AddClientToProjectSagaPayload,
): Promise<AddClientToProjectSagaResult> {
  const context: AddClientToProjectContext = {
    payload,
    userWithTenantResponse: undefined,
    addOrRemoveClientFromProjectResponse: undefined,
  };

  const steps: SagaStep<AddClientToProjectContext>[] = [
    new SagaStep<AddClientToProjectContext>(
      'CreateUserIfNotExists',
      async (stepContext) => {
        const {
          payload: {
            user: { email, name, tenantId, type },
          },
        } = stepContext;

        const response = await identityGrpcClient.createUserIfNotExists({
          tenantId,
          name,
          email,
          type,
        });

        stepContext.userWithTenantResponse = response;
      },
      async (stepContext) => {
        const { userWithTenantResponse } = stepContext;

        if (!userWithTenantResponse) {
          return;
        }

        const { id, tenantId } = userWithTenantResponse;

        await identityGrpcClient.deleteUser({
          id,
          tenantId,
        });
      },
    ),
    new SagaStep<AddClientToProjectContext>(
      'AddClientToProject',
      async (stepContext) => {
        const {
          userWithTenantResponse: { id: clientId },
          payload: {
            project: { id: projectId, tenantId },
          },
        } = stepContext;

        const response = await cmsGrpcClient.addClientToProject({
          projectId,
          tenantId,
          clientId,
        });

        stepContext.addOrRemoveClientFromProjectResponse = response;
      },
      async (stepContext) => {
        const {
          payload: {
            project: { id: projectId },
            user: { tenantId },
          },
          userWithTenantResponse: { id: clientId },
        } = stepContext;

        await cmsGrpcClient.removeClientFromProject({
          clientId,
          projectId,
          tenantId,
        });
      },
    ),
    new SagaStep<AddClientToProjectContext>(
      'SendMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);
}
