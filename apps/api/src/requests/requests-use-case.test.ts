import { describe, expect, it, vi } from "vitest";
import { makeCreateRequestUseCase } from "./requests-use-case";

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
