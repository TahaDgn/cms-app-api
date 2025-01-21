import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY,
  ProjectNotFoundException,
  ProjectRepositorySign,
  TICKET_REPOSITORY,
  TicketRepositorySign,
} from '../../domain';
import {
  AuthorizedUserPayload,
  CreateTicketPayload,
  DeleteTicketPayload,
  GetTicketPayload,
  GetTicketResponse,
  ListTicketsPayload,
  ListTicketsResponse,
  UpdateTicketPayload,
} from 'libs/interfaces';
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class TicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepositorySign,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
  ) {}

  public async create(
    payload: CreateTicketPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { projectId, ...restOfPayload } = payload;
    const { tenantId, id: createdBy } = user;

    const project = await this.projectRepository.findFirst({
      where: {
        id: projectId,
        tenantId,
        clientUserIds: {
          has: createdBy,
        },
      },
    });

    if (!project) throw new ProjectNotFoundException();

    return this.ticketRepository.create({
      data: {
        tenantId,
        createdBy,
        project: { connect: { id: projectId, tenantId } },
        ...restOfPayload,
      },
      include: {
        ticketComments: true,
      },
    });
  }

  public async update(
    payload: UpdateTicketPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { id, ...restOfUpdatePayload } = payload;

    const { tenantId } = user;

    return this.ticketRepository.update({
      where: {
        id,
        tenantId,
      },
      data: {
        ...restOfUpdatePayload,
      },
      include: {
        ticketComments: true,
      },
    });
  }

  public async list(
    payload: ListTicketsPayload,
    user: AuthorizedUserPayload,
  ): Promise<ListTicketsResponse> {
    const { where, skip, take } = payload;

    const { id: possibleClientId, tenantId, type } = user;

    const clientQuery: Pick<Prisma.TicketWhereInput, 'project'> =
      type === UserType.CLIENT
        ? {
            project: {
              clientUserIds: {
                has: possibleClientId,
              },
            },
          }
        : {
            project: undefined,
          };

    const tickets = await this.ticketRepository.findAll({
      where: {
        ...where,
        ...clientQuery,
        tenantId,
      },
      skip,
      take,
    });

    const totalItemsCount = await this.ticketRepository.count({
      where,
    });

    return {
      tickets,
      totalItemsCount,
    };
  }

  public async getOrFail(
    payload: GetTicketPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { where } = payload;

    const { id: possibleClientId, tenantId, type } = user;

    const clientQuery: Pick<Prisma.TicketWhereInput, 'project'> =
      type === UserType.CLIENT
        ? {
            project: {
              clientUserIds: {
                has: possibleClientId,
              },
            },
          }
        : {
            project: undefined,
          };

    const project = await this.ticketRepository.findFirst({
      where: {
        ...where,
        ...clientQuery,
        tenantId,
      },
      include: {
        ticketComments: true,
      },
    });

    if (!project) throw new ProjectNotFoundException();

    return project;
  }

  public async delete(
    payload: DeleteTicketPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { tenantId } = user;

    return this.ticketRepository.delete({
      where: {
        ...payload,
        tenantId,
      },
      include: {
        ticketComments: true,
      },
    });
  }
}
