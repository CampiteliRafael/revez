import express, { type ErrorRequestHandler } from "express";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware/auth";
import { requireOperator } from "./middleware/require-operator";
import { requestsRepository } from "./requests/requests-repository";
import { makeCreateRequestUseCase } from "./requests/requests-use-case";
import { createRequestsRouter } from "./requests/requests-routes";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const createRequestUseCase = makeCreateRequestUseCase(requestsRepository);
app.use("/requests", createRequestsRouter(createRequestUseCase));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", database: "ok" });
  } catch (error) {
    console.error("Database health check failed", error);
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.get("/me", authMiddleware, (req, res) => {
  if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    userId: req.user.userId,
    groups: req.user.groups,
  });
});

app.get("/operator-check", authMiddleware, requireOperator, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    message: "Operator access granted",
    userId: req.user.userId,
  });
});

const errorHandler: ErrorRequestHandler = (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
console.error("Unhandled API error:", err);
if(res.headersSent) {
  next(err);
  return;
}
res.status(500).json({ message: "Internal Server Error" });
}

app.use(errorHandler);
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export {};
