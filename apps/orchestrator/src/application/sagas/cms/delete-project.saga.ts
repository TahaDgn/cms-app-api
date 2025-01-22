import { CmsGrpcClient, IdentityGrpcClient } from '../../grpc-clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  DeleteProjectSagaPayload,
  GetProjectResponse,
  GetTenantResponse,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

interface CreateProjectContext {
  payload: DeleteProjectSagaPayload;
  getProjectResponse?: GetProjectResponse;
  getTenantResponse?: GetTenantResponse;
}

export async function deleteProjectSaga(
  cmsGrpcClient: CmsGrpcClient,
  identityGrpcClient: IdentityGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: DeleteProjectSagaPayload,
  metadata: Metadata,
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

        const response = await cmsGrpcClient.deleteProject(payload, metadata);

        stepContext.getProjectResponse = response;
      },
      async (stepContext) => {
        const { getProjectResponse } = stepContext;

        if (!getProjectResponse) return;

        await cmsGrpcClient.createProject(
          {
            ...getProjectResponse.project,
          },
          metadata,
        );
      },
    ),
    new SagaStep<CreateProjectContext>(
      'DecrementTenantProjectsCount',
      async (stepContext) => {
        const response = await identityGrpcClient.decrementTenantProjectsCount(
          undefined,
          metadata,
        );

        stepContext.getTenantResponse = response;
      },
      async (stepContext) => {
        const { getTenantResponse } = stepContext;

        if (!getTenantResponse) return;

        await identityGrpcClient.incrementTenantProjectsCount(
          undefined,
          metadata,
        );
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
