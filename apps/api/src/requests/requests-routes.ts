import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createRequestController,
  listRequestsController,
} from "./requests-controller";
import { validateCreateRequest } from "./validate-create-request";
import type {
  CreateRequestUseCase,
  ListRequestsUseCase,
} from "./requests-use-case";

export function createRequestsRouter(
  createRequest: CreateRequestUseCase,
  listRequests: ListRequestsUseCase,
) {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    validateCreateRequest,
    createRequestController(createRequest),
  );

  router.get("/", authMiddleware, listRequestsController(listRequests));
  return router;
}
