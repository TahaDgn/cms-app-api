import { Prisma, Project, Ticket, TicketComment } from '@prisma/client';
import { Observable } from 'rxjs';
import { PaginationPayload, TotalItemsCount } from './shared.interface';
import { Metadata } from '@grpc/grpc-js';

export interface CmsService {
  // ---- PROJECT ---- //

  createProject(
    payload: CreateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  getProject(
    payload: GetProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  listProjects(
    payload: ListProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> | Observable<ListProjectsResponse>;

  updateProject(
    payload: UpdateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  addClientsToProjects(
    payload: AddClientsToProjectsPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  removeClientsFromProjects(
    payload: RemoveClientsFromProjectsPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  deleteProject(
    payload: DeleteProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> | Observable<GetProjectResponse>;

  // ---- TICKET ---- //

  createTicket(
    payload: CreateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  getTicket(
    payload: GetTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  listTickets(
    payload: ListTicketPayload,
    metadata: Metadata,
  ): Promise<ListTicketResponse> | Observable<ListTicketResponse>;

  updateTicket(
    payload: UpdateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  deleteTicket(
    payload: DeleteTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  // ---- TICKET COMMENT ---- //

  createTicketComment(
    payload: CreateTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;

  deleteTicketComment(
    payload: DeleteTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> | Observable<GetTicketResponse>;
}

// ---- PROJECT ---- //

export type CreateProjectPayload = Pick<Project, 'title' | 'description'>;

export type GetProjectPayload = Prisma.ProjectFindFirstArgs;

export type GetProjectResponse = Prisma.ProjectGetPayload<{
  include: { tickets: true };
}>;

export interface ListProjectsPayload extends PaginationPayload {
  where: Prisma.ProjectWhereInput;
}

export interface ListProjectsResponse extends TotalItemsCount {
  projects: Project[];
}

export type UpdateProjectPayload = Pick<
  Project,
  'id' | 'description' | 'status' | 'title'
>;

export interface AddClientsToProjectsPayload
  extends Pick<Project, 'clientUserIds'> {
  ids: number[];
}

export interface RemoveClientsFromProjectsPayload
  extends Pick<Project, 'clientUserIds'> {
  ids: number[];
}

export type DeleteProjectPayload = Pick<Project, 'id'>;

// ---- TICKET ---- //

export type CreateTicketPayload = Pick<Ticket, 'description' | 'projectId'>;

export type GetTicketPayload = Prisma.TicketFindFirstArgs;

export type GetTicketResponse = Prisma.TicketGetPayload<{
  include: { ticketComments: true };
}>;

export interface ListTicketPayload extends PaginationPayload {
  where: Prisma.TicketWhereInput;
}

export interface ListTicketResponse extends TotalItemsCount {
  tickets: Ticket[];
}

export type UpdateTicketPayload = Pick<Ticket, 'id' | 'description' | 'status'>;

export type DeleteTicketPayload = Pick<Ticket, 'id'>;

// ---- TICKET COMMENT ---- //

export type CreateTicketCommentPayload = Pick<
  TicketComment,
  'ticketId' | 'content'
>;

export type DeleteTicketCommentPayload = Pick<TicketComment, 'id'>;
