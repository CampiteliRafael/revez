import type { Request, Response, NextFunction } from "express";
import { createRequestSchema } from "@revez/contracts";

export function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    const result = createRequestSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
    req.body = result.data;
    return next();
};