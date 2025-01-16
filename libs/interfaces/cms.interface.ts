import { Prisma, Project, Ticket, TicketComment } from '@prisma/client';
import { Observable } from 'rxjs';

export interface CmsService {
  // ---- PROJECT ---- //

  createProject(
    payload: CreateProjectPayload,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  getProject(
    payload: GetProjectPayload,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  listProjects(
    payload: ListProjectsPayload,
  ): Promise<ListProjectsResponse> | Observable<ListProjectsResponse>;

  updateProject(
    payload: UpdateProjectPayload,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  addClientsToProject(
    payload: AddClientsToProject,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  removeClientsFromProject(
    payload: RemoveClientsFromProjectPayload,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  deleteProject(
    payload: DeleteProjectPayload,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  // ---- TICKET ---- //

  createTicket(
    payload: CreateTicketPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  getTicket(
    payload: GetTicketPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  listTickets(
    payload: ListTicketPayload,
  ): Promise<ListTicketResponse> | Observable<ListTicketResponse>;

  updateTicket(
    payload: UpdateTicketPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  deleteTicket(
    payload: DeleteTicketPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  // ---- TICKET COMMENT ---- //

  createTicketComment(
    payload: CreateTicketCommentPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  deleteTicketComment(
    payload: DeleteTicketCommentPayload,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;
}

// ---- PROJECT ---- //

export type CreateProjectPayload = Pick<
  Project,
  'title' | 'description' | 'tenantId'
>;

export type GetProjectPayload = Prisma.ProjectFindFirstArgs;

export type GetProjectResponse = Prisma.ProjectGetPayload<{
  include: { tickets: true };
}>;

export type ListProjectsPayload = Prisma.ProjectFindManyArgs;

export interface ListProjectsResponse {
  projects: Project[];
}

export type UpdateProjectPayload = Prisma.ProjectUpdateArgs;

export type AddClientsToProject = Pick<
  Project,
  'id' | 'clientUserIds' | 'tenantId'
>;

export type RemoveClientsFromProjectPayload = Pick<
  Project,
  'id' | 'clientUserIds' | 'tenantId'
>;

export type DeleteProjectPayload = GetProjectPayload;

// ---- TICKET ---- //

export type CreateTicketPayload = Pick<
  Ticket,
  'description' | 'projectId' | 'tenantId'
>;

export type GetTicketPayload = Prisma.TicketFindFirstArgs;

export type GetTicketResponse = Prisma.TicketGetPayload<{
  include: { ticketComments: true };
}>;

export type ListTicketPayload = Prisma.TicketFindManyArgs;

export interface ListTicketResponse {
  tickets: Ticket[];
}

export type UpdateTicketPayload = Prisma.TicketUpdateArgs;

export type DeleteTicketPayload = GetTicketPayload;

// ---- TICKET COMMENT ---- //

export type CreateTicketCommentPayload = Pick<
  TicketComment,
  'tenantId' | 'ticketId' | 'createdBy' | 'content'
>;

export type DeleteTicketCommentPayload = GetTicketPayload;
