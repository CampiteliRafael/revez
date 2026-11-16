import { prisma } from "../prisma";
import type { RequestsRepository } from "./requests-use-case";

export const requestsRepository: RequestsRepository = {
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
};