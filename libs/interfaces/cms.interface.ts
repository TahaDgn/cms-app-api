import { Prisma, Project, Ticket } from '@prisma/client';

export interface CmsService {
  createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse>;

  getProject(payload: GetProjectPayload): Promise<GetProjectResponse>;

  listProjects(payload: ListProjectsPayload): Promise<ListProjectsResponse>;

  listClientProjects(
    payload: ListClientProjectPayload,
  ): Promise<ListClientProjectsResponse>;

  deleteProject(payload: DeleteProjectPayload): Promise<DeleteProjectResponse>;

  updateProject(payload: UpdateProjectPayload): Promise<UpdateProjectResponse>;

  addClientToProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse>;

  removeClientFromProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse>;

  createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse>;

  updateTicket(payload: UpdateTicketPayload): Promise<UpdateTicketResponse>;

  deleteTicket(payload: DeleteTicketPayload): Promise<DeleteTicketResponse>;
}

export type ProjectWithTicketsResponse = Prisma.ProjectGetPayload<{
  include: { tickets: true };
}>;

export type CreateProjectPayload = Pick<
  Project,
  'title' | 'description' | 'tenantId'
>;

export type CreateProjectResponse = Project;

export type GetProjectPayload = Pick<Project, 'id' | 'tenantId'>;

export type GetProjectResponse = ProjectWithTicketsResponse;

export type ListProjectsPayload = Pick<Project, 'tenantId'>;

export interface ListProjectsResponse {
  projects: ProjectWithTicketsResponse[];
}

export interface ListClientProjectPayload extends Pick<Project, 'tenantId'> {
  clientId: number;
}

export interface ListClientProjectsResponse {
  projects: ProjectWithTicketsResponse[];
}

export type DeleteProjectPayload = Pick<Project, 'id' | 'tenantId'>;

export type DeleteProjectResponse = Project;

export type UpdateProjectPayload = Pick<
  Project,
  'id' | 'tenantId' | 'status' | 'description' | 'title'
>;

export type UpdateProjectResponse = ProjectWithTicketsResponse;

export interface AddOrRemoveClientFromProjectPayload {
  projectId: number;
  tenantId: number;
  clientId: number;
}

export type AddOrRemoveClientFromProjectResponse = void;

export type CreateTicketPayload = Pick<
  Ticket,
  'description' | 'projectId' | 'tenantId'
>;

export type CreateTicketResponse = Ticket;

export type DeleteTicketPayload = Pick<Ticket, 'id' | 'tenantId'>;

export type DeleteTicketResponse = Ticket;

export type UpdateTicketPayload = Pick<
  Ticket,
  'id' | 'tenantId' | 'status' | 'description'
>;

export type UpdateTicketResponse = Ticket;
