import { Prisma, Project, Ticket, TicketComment } from '@prisma/client';
import { Observable } from 'rxjs';
import { TotalItemsCount } from './shared.interface';

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

  addClientsToProjects(
    payload: AddClientsToProjectsPayload,
  ): Promise<ListProjectsResponse> | Observable<ListProjectsResponse>;

  removeClientsFromProjects(
    payload: RemoveClientsFromProjectsPayload,
  ): Promise<ListProjectsResponse> | Observable<ListProjectsResponse>;

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

export interface ListProjectsResponse extends TotalItemsCount {
  projects: Project[];
}

export type UpdateProjectPayload = Prisma.ProjectUpdateArgs;

export interface AddClientsToProjectsPayload
  extends Pick<Project, 'clientUserIds' | 'tenantId'> {
  ids: number[];
}

export interface RemoveClientsFromProjectsPayload
  extends Pick<Project, 'clientUserIds' | 'tenantId'> {
  ids: number[];
}

export type DeleteProjectPayload = Pick<Project, 'id' | 'tenantId'>;

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

export interface ListTicketResponse extends TotalItemsCount {
  tickets: Ticket[];
}

export type UpdateTicketPayload = Prisma.TicketUpdateArgs;

export type DeleteTicketPayload = Pick<Ticket, 'id' | 'tenantId'>;

// ---- TICKET COMMENT ---- //

export type CreateTicketCommentPayload = Pick<
  TicketComment,
  'tenantId' | 'ticketId' | 'createdBy' | 'content'
>;

export type DeleteTicketCommentPayload = Pick<TicketComment, 'id' | 'tenantId'>;
