import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyAccessToken: vi.fn(),
  createRequest: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("./auth/keycloak", () => ({
  verifyAccessToken: mocks.verifyAccessToken,
  operatorsGroup: "operators",
  InvalidAccessTokenError: class InvalidAccessTokenError extends Error {},
}));

vi.mock("./prisma", () => ({
  prisma: {
    $queryRaw: mocks.queryRaw,
  },
}));

vi.mock("./requests/requests-repository", () => ({
  requestsRepository: {
    createRequest: mocks.createRequest,
  },
}));

import { app } from "./app";

describe("API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /requests", () => {
    it("should create a request and return 201", async () => {
      mocks.verifyAccessToken.mockResolvedValue({
        userId: "user-123",
        groups: [],
      });

      mocks.createRequest.mockResolvedValue({
        id: "request-123",
        status: "NEW",
      });

      const response = await request(app)
        .post("/requests")
        .set("Authorization", "Bearer valid-token")
        .send({
          title: "Computer maintenance",
          description: "Computer is not working",
          category: "IT",
          priority: "HIGH",
          dueDate: "2026-12-01",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: "request-123",
        status: "NEW",
      });

      expect(mocks.createRequest).toHaveBeenCalledWith({
        creatorId: "user-123",
        input: {
          title: "Computer maintenance",
          description: "Computer is not working",
          category: "IT",
          priority: "HIGH",
          dueDate: "2026-12-01",
        },
      });
    });

    it("should return 400 when request data is invalid", async () => {
      mocks.verifyAccessToken.mockResolvedValue({
        userId: "user-123",
        groups: [],
      });

      const response = await request(app)
        .post("/requests")
        .set("Authorization", "Bearer valid-token")
        .send({
          title: "",
          description: "Invalid request",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid request body");
      expect(mocks.createRequest).not.toHaveBeenCalled();
    });

    it("should return 401 when the user is not authenticated", async () => {
      const response = await request(app).post("/requests").send({
        title: "Computer maintenance",
        description: "Computer is not working",
        category: "IT",
        priority: "HIGH",
        dueDate: "2026-12-01",
      });

      expect(response.status).toBe(401);
      expect(mocks.createRequest).not.toHaveBeenCalled();
    });
  });

  describe("GET /me", () => {
    it("should return the authenticated user's information", async () => {
      mocks.verifyAccessToken.mockResolvedValue({
        userId: "user-123",
        groups: ["operators"],
      });

      const response = await request(app)
        .get("/me")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: "user-123",
        groups: ["operators"],
      });
    });

    it("should return 401 when the user is not authenticated", async () => {
      const response = await request(app).get("/me");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /operator-check", () => {
    it("should allow users who belong to the operators group", async () => {
      mocks.verifyAccessToken.mockResolvedValue({
        userId: "operator-123",
        groups: ["operators"],
      });

      const response = await request(app)
        .get("/operator-check")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        message: "Operator access granted",
        userId: "operator-123",
      });
    });

    it("should return 403 when the user is not an operator", async () => {
      mocks.verifyAccessToken.mockResolvedValue({
        userId: "user-123",
        groups: [],
      });

      const response = await request(app)
        .get("/operator-check")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: "Forbidden",
      });
    });

    it("should return 401 when the user is not authenticated", async () => {
      const response = await request(app).get("/operator-check");

      expect(response.status).toBe(401);
    });
  });
});
