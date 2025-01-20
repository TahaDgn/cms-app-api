import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  CreateProjectSagaPayload,
  GetProjectResponse,
  GetTenantResponse,
} from 'libs/interfaces';

interface CreateProjectContext {
  payload: CreateProjectSagaPayload;
  getProjectResponse?: GetProjectResponse;
  getTenantResponse?: GetTenantResponse;
}

export async function createProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: CreateProjectSagaPayload,
): Promise<GetProjectResponse> {
  const context: CreateProjectContext = {
    payload,
    getProjectResponse: undefined,
    getTenantResponse: undefined,
  };

  const steps: SagaStep<CreateProjectContext>[] = [
    new SagaStep<CreateProjectContext>(
      'CreateProject',
      async (stepContext) => {
        const { payload } = stepContext;

        const response = await cmsGrpcClient.createProject(payload);

        stepContext.getProjectResponse = response;
      },
      async (stepContext) => {
        const { getProjectResponse } = stepContext;

        if (!getProjectResponse) return;

        const { id, tenantId } = getProjectResponse;

        await cmsGrpcClient.deleteProject({
          id,
          tenantId,
        });
      },
    ),
    new SagaStep<CreateProjectContext>(
      'IncrementTenantProjectsCount',
      async (stepContext) => {
        const {
          payload: { tenantId },
        } = stepContext;

        const response = await identityGrpcClient.incrementTenantProjectsCount({
          id: tenantId,
        });

        stepContext.getTenantResponse = response;
      },
      async (stepContext) => {
        const { getTenantResponse } = stepContext;

        if (!getTenantResponse) return;

        const { id } = getTenantResponse;

        await identityGrpcClient.decrementTenantProjectsCount({ id });
      },
    ),
    new SagaStep<CreateProjectContext>(
      'SendInformationMail',
      async () => {},
      async () => {},
    ),
  ];

  await runSaga(steps, context);

  return context.getProjectResponse;
}
