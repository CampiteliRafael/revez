import { describe, expect, it, vi } from "vitest";
import {
  makeCreateRequestUseCase,
  makeListRequestsUseCase,
} from "./requests-use-case";

describe("makeCreateRequestUseCase", () => {
  it("should delegate request creation to the repository", async () => {
    const repository = {
      createRequest: vi.fn().mockResolvedValue({
        id: "request-123",
        status: "NEW" as const,
      }),
    };

    const createRequest = makeCreateRequestUseCase(repository);

    const command = {
      creatorId: "user-123",
      input: {
        title: "Computer maintenance",
        description: "Computer is not working",
        category: "IT" as const,
        priority: "HIGH" as const,
        dueDate: "2026-12-01",
      },
    };

    const result = await createRequest(command);

    expect(repository.createRequest).toHaveBeenCalledWith(command);

    expect(result).toEqual({
      id: "request-123",
      status: "NEW",
    });
  });

  it("should propagate repository errors", async () => {
    const repositoryError = new Error("Database error");

    const repository = {
      createRequest: vi.fn().mockRejectedValue(repositoryError),
    };

    const createRequest = makeCreateRequestUseCase(repository);

    await expect(
      createRequest({
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

describe("makeListRequestsUseCase", () => {
  it("should list all requests when the user is an operator", async () => {
    const repository = {
      listRequests: vi.fn().mockResolvedValue({
        items: [],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 0,
          totalPages: 0,
        },
      }),
    };

    const listRequests = makeListRequestsUseCase(repository);

    await listRequests({
      query: {
        page: 1,
        pageSize: 20,
      },
      isOperator: true,
      requesterId: "operator-123",
    });

    expect(repository.listRequests).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
    });
  });

  it("should list only the requester's requests when the user is not an operator", async () => {
    const repository = {
      listRequests: vi.fn().mockResolvedValue({
        items: [],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 0,
          totalPages: 0,
        },
      }),
    };

    const listRequests = makeListRequestsUseCase(repository);

    await listRequests({
      query: {
        page: 2,
        pageSize: 10,
      },
      isOperator: false,
      requesterId: "requester-123",
    });

    expect(repository.listRequests).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      createdById: "requester-123",
    });
  });
});
