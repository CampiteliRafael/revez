import type { Request, Response, NextFunction } from "express";
import { operatorsGroup } from "../auth/keycloak";

export const requireOperator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user.groups.includes(operatorsGroup)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
