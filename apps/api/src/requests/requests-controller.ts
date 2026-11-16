import type { RequestHandler } from "express";
import type { CreateRequestInput } from "@revez/contracts";
import type { CreateRequestUseCase } from "./requests-use-case";

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