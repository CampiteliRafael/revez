import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createRequestController } from "./requests-controller";
import { validateCreateRequest } from "./validate-create-request";
import type { CreateRequestUseCase } from "./requests-use-case";

export function createRequestsRouter(createRequest: CreateRequestUseCase) {
    const router = Router();

    router.post(
        "/",
        authMiddleware,
        validateCreateRequest,
        createRequestController(createRequest),
    );
    return router;
}