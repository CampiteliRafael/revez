import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AuthenticatedUser, InvalidAccessTokenError } from '../auth/keycloak';

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const match = authHeader?.match(/^Bearer\s+(\S+)$/i);
    const token = match?.[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    verifyAccessToken(token)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error: unknown) => {
            if (error instanceof InvalidAccessTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            }

            return next(error);
        });
}