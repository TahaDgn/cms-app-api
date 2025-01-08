import { CmsGrpcClient, IdentityGrpcClient } from '../../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import { runSaga } from '../../saga-runner';
import { SagaStep } from '../../saga-step';
import {
  UserWithTenantResponse,
  UserDeletionSagaPayload,
  UserDeletionSagaResult,
  ListClientProjectsResponse,
  AddOrRemoveClientFromProjectPayload,
  NotificationType,
} from 'libs/interfaces';
import { UserType } from '@prisma/client';
import { NOTIFICATION_QUEUE } from 'libs/constants';

interface UserDeletionContext {
  payload: UserDeletionSagaPayload;
  userWithTenantResponse?: UserWithTenantResponse;
  listClientProjectsResponse?: ListClientProjectsResponse;
  addOrRemoveClientFromProjectPayloads?: AddOrRemoveClientFromProjectPayload[];
}

export async function userDeletionSaga(
  identityGrpcClient: IdentityGrpcClient,
  cmsGrpcClient: CmsGrpcClient,
  rabbitMqAdapter: RabbitMQAdapter,
  payload: UserDeletionSagaPayload,
): Promise<UserDeletionSagaResult> {
  const context: UserDeletionContext = {
    payload,
    userWithTenantResponse: undefined,
    listClientProjectsResponse: undefined,
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

        stepContext.userWithTenantResponse = response;
      },
      async (stepContext) => {
        const { userWithTenantResponse: deletedUserResponse } = stepContext;
        if (!deletedUserResponse) {
          return;
        }

        const { email, name, tenantId, type } = deletedUserResponse;

        await identityGrpcClient.createUserIfNotExists({
          email,
          name,
          tenantId,
          type,
        });
      },
    ),
    new SagaStep<UserDeletionContext>(
      'GetClientProjects',
      async (stepContext) => {
        const {
          userWithTenantResponse: { id: clientId, type, tenantId },
        } = stepContext;

        if (type !== UserType.CLIENT) {
          return;
        }

        const response = await cmsGrpcClient.listClientProjects({
          clientId,
          tenantId,
        });

        const { projects } = response;

        if (projects.length < 1) {
          return;
        }

        stepContext.listClientProjectsResponse = response;
      },
      async () => {},
    ),
    new SagaStep<UserDeletionContext>(
      'RemoveClientFromProjects',
      async (stepContext) => {
        const {
          listClientProjectsResponse,
          userWithTenantResponse: { id: clientId },
        } = stepContext;

        if (!listClientProjectsResponse) {
          return;
        }

        const { projects } = listClientProjectsResponse;

        const responses = await Promise.all(
          projects.map(
            async (project): Promise<AddOrRemoveClientFromProjectPayload> => {
              const { id: projectId, tenantId } = project;

              await cmsGrpcClient.removeClientFromProject({
                clientId,
                projectId,
                tenantId,
              });

              return {
                clientId,
                projectId,
                tenantId,
              };
            },
          ),
        );

        context.addOrRemoveClientFromProjectPayloads = responses;
      },
      async (stepContext) => {
        const { addOrRemoveClientFromProjectPayloads } = stepContext;

        if (!addOrRemoveClientFromProjectPayloads) {
          return;
        }

        await Promise.all(
          addOrRemoveClientFromProjectPayloads.map(
            async (addOrRemoveClientFromProjectPayload) => {
              await cmsGrpcClient.addClientToProject(
                addOrRemoveClientFromProjectPayload,
              );
            },
          ),
        );
      },
    ),
    new SagaStep<UserDeletionContext>(
      'SendMail',
      async (stepContext) => {
        const {
          userWithTenantResponse: {
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

  return context.userWithTenantResponse;
}
