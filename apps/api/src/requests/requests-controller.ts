import type { RequestHandler } from "express";
import {
  listRequestsQuerySchema,
  type CreateRequestInput,
} from "@revez/contracts";
import { operatorsGroup } from "../auth/keycloak";
import type {
  CreateRequestUseCase,
  ListRequestsUseCase,
} from "./requests-use-case";
export function createRequestController(
  createRequest: CreateRequestUseCase,
): RequestHandler<Record<string, string>, unknown, CreateRequestInput> {
  return async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const result = await createRequest({
        input: req.body,
        creatorId: req.user.userId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export function listRequestsController(
  listRequests: ListRequestsUseCase,
): RequestHandler {
  return async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const isOperator = req.user.groups.includes(operatorsGroup);

    const parsedQuery = listRequestsQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      res.status(400).json({
        message: "Invalid query parameters",
      });
      return;
    }
    try {
      const result = await listRequests({
        query: parsedQuery.data,
        isOperator,
        requesterId: req.user.userId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
