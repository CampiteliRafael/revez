import express, { type ErrorRequestHandler } from "express";
import { prisma } from "./prisma";

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", database: "ok" });
  } catch (error) {
    console.error("Database health check failed", error);
    res.status(503).json({ status: "error", database: "unavailable" });
  }
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
