import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userUpsert: vi.fn(),
  requestCreate: vi.fn(),
  requestEventCreate: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    $transaction: mocks.transaction,
  },
}));

import { requestsRepository } from "./requests-repository";

describe("requestsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.userUpsert.mockResolvedValue({});
    mocks.requestCreate.mockResolvedValue({ id: "request-123" });
    mocks.requestEventCreate.mockResolvedValue({});

    mocks.transaction.mockImplementation(
      async (
        callback: (tx: {
          user: { upsert: typeof mocks.userUpsert };
          request: { create: typeof mocks.requestCreate };
          requestEvent: { create: typeof mocks.requestEventCreate };
        }) => Promise<unknown>,
      ) =>
        callback({
          user: { upsert: mocks.userUpsert },
          request: { create: mocks.requestCreate },
          requestEvent: { create: mocks.requestEventCreate },
        }),
    );
  });

  it("should create a request and register its creation event", async () => {
    const result = await requestsRepository.createRequest({
      creatorId: "user-123",
      input: {
        title: "Computer maintenance",
        description: "Computer is not working",
        category: "IT",
        priority: "HIGH",
        dueDate: "2026-12-01",
      },
    });

    expect(mocks.transaction).toHaveBeenCalledOnce();

    expect(mocks.userUpsert).toHaveBeenCalledWith({
      where: { id: "user-123" },
      create: { id: "user-123" },
      update: {},
    });

    expect(mocks.requestCreate).toHaveBeenCalledWith({
      data: {
        title: "Computer maintenance",
        description: "Computer is not working",
        category: "IT",
        priority: "HIGH",
        dueDate: new Date("2026-12-01T00:00:00.000Z"),
        createdById: "user-123",
        status: "NEW",
      },
      select: { id: true },
    });

    expect(mocks.requestEventCreate).toHaveBeenCalledWith({
      data: {
        action: "REQUEST_CREATED",
        requestId: "request-123",
        actorId: "user-123",
      },
    });

    expect(result).toEqual({
      id: "request-123",
      status: "NEW",
    });
  });

  it("should propagate errors from the database transaction", async () => {
    const databaseError = new Error("Database error");

    mocks.requestCreate.mockRejectedValue(databaseError);

    await expect(
      requestsRepository.createRequest({
        creatorId: "user-123",
        input: {
          title: "Computer maintenance",
          description: "Computer is not working",
          category: "IT",
          priority: "HIGH",
          dueDate: "2026-12-01",
        },
      }),
    ).rejects.toThrow("Database error");
  });
});
