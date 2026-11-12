import express from "express";
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export {};
