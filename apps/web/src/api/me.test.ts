import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "./api-client";
import { getCurrentUser } from "./me";

function createApiMock(getImplementation: () => Promise<unknown>) {
  return {
    get: vi.fn(getImplementation),
  } as unknown as ApiClient;
}

describe("getCurrentUser", () => {
  it("should return the current user successfully", async () => {
    const api = createApiMock(() =>
      Promise.resolve({
        userId: "user-123",
        groups: ["USER", "OPERATOR"],
      }),
    );

    const result = await getCurrentUser(api);

    expect(result).toEqual({
      userId: "user-123",
      groups: ["USER", "OPERATOR"],
    });

    expect(api.get).toHaveBeenCalledWith("/me", {
      authenticated: true,
    });
  });

  it("should accept an empty groups array", async () => {
    const api = createApiMock(() =>
      Promise.resolve({
        userId: "user-123",
        groups: [],
      }),
    );

    await expect(getCurrentUser(api)).resolves.toEqual({
      userId: "user-123",
      groups: [],
    });
  });

  it("should throw when userId is missing or invalid", async () => {
    const api = createApiMock(() =>
      Promise.resolve({
        userId: 123,
        groups: ["USER"],
      }),
    );

    await expect(getCurrentUser(api)).rejects.toThrow(
      "Resposta inesperada da API",
    );
  });

  it("should throw when groups is not an array", async () => {
    const api = createApiMock(() =>
      Promise.resolve({
        userId: "user-123",
        groups: "USER",
      }),
    );

    await expect(getCurrentUser(api)).rejects.toThrow(
      "Resposta inesperada da API",
    );
  });

  it("should throw when groups contains invalid values", async () => {
    const api = createApiMock(() =>
      Promise.resolve({
        userId: "user-123",
        groups: ["USER", 123],
      }),
    );

    await expect(getCurrentUser(api)).rejects.toThrow(
      "Resposta inesperada da API",
    );
  });

  it("should propagate API errors", async () => {
    const error = new Error("Unauthorized");

    const api = createApiMock(() => Promise.reject(error));

    await expect(getCurrentUser(api)).rejects.toBe(error);
  });
});
