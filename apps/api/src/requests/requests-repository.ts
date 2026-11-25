import { prisma } from "../prisma";
import type {
  RequestsRepository,
  RequestsListingRepository,
} from "./requests-use-case";

export const requestsRepository: RequestsRepository &
  RequestsListingRepository = {
  async createRequest({ input, creatorId }) {
    return prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: creatorId },
        create: { id: creatorId },
        update: {},
      });

      const request = await tx.request.create({
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          priority: input.priority,
          dueDate: new Date(`${input.dueDate}T00:00:00.000Z`),
          createdById: creatorId,
          status: "NEW",
        },
        select: { id: true },
      });

      await tx.requestEvent.create({
        data: {
          action: "REQUEST_CREATED",
          requestId: request.id,
          actorId: creatorId,
        },
      });

      return {
        id: request.id,
        status: "NEW",
      };
    });
  },

  async listRequests({ page, pageSize, createdById }) {
    const where = {
      ...(createdById ? { createdById } : {}),
    };

    const [items, totalItems] = await Promise.all([
      prisma.request.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          status: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
          creator: {
            select: {
              id: true,
              displayName: true,
            },
          },
          assignee: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      }),

      prisma.request.count({ where }),
    ]);

    return {
      items: items.map(({ creator, ...request }) => ({
        ...request,
        createdBy: creator,
      })),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  },
};
