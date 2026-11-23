import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "./api-client";
import { ApiError } from "./api-error";
import { createRequest } from "./requests";
import type { CreateRequestInput } from "@revez/contracts";

const input: CreateRequestInput = {
  title: "Solicitação de acesso",
  description: "Preciso de acesso ao ambiente de homologação",
  category: "IT",
  priority: "MEDIUM",
  dueDate: "2026-12-01",
};

function createApiMock(postImplementation: () => Promise<unknown>) {
  return {
    post: vi.fn(postImplementation),
  } as unknown as ApiClient;
}

describe("createRequest", () => {
  it("should create a request successfully", async () => {
    const api = createApiMock(() =>
      Promise.resolve({ id: "request-123", status: "NEW" }),
    );

    const result = await createRequest(api, input);

    expect(result).toEqual({
      id: "request-123",
      status: "NEW",
    });

    expect(api.post).toHaveBeenCalledWith("/requests", input, {
      authenticated: true,
    });
  });

  it("should throw NETWORK when the API request fails", async () => {
    const api = createApiMock(() =>
      Promise.reject(
        new ApiError("Não foi possível conectar à API", 0, "NETWORK"),
      ),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      name: "CreateRequestError",
      code: "NETWORK",
    });
  });

  it("should throw VALIDATION when the API returns 400", async () => {
    const api = createApiMock(() =>
      Promise.reject(new ApiError("Invalid request", 400, "HTTP_ERROR")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });

  it("should throw VALIDATION when the API returns 422", async () => {
    const api = createApiMock(() =>
      Promise.reject(new ApiError("Invalid request", 422, "HTTP_ERROR")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });

  it("should throw UNAUTHORIZED when the API returns 401", async () => {
    const api = createApiMock(() =>
      Promise.reject(new ApiError("Unauthorized", 401, "HTTP_ERROR")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("should throw UNAUTHORIZED when the API returns 403", async () => {
    const api = createApiMock(() =>
      Promise.reject(new ApiError("Forbidden", 403, "HTTP_ERROR")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("should throw SERVER when the API returns a 5xx error", async () => {
    const api = createApiMock(() =>
      Promise.reject(new ApiError("Internal error", 500, "HTTP_ERROR")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "SERVER",
    });
  });

  it("should throw UNEXPECTED when the response has an invalid structure", async () => {
    const api = createApiMock(() =>
      Promise.resolve({ id: 123, status: "NEW" }),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "UNEXPECTED",
    });
  });

  it("should throw UNEXPECTED when the API returns an unknown error", async () => {
    const api = createApiMock(() =>
      Promise.reject(new Error("Unexpected error")),
    );

    await expect(createRequest(api, input)).rejects.toMatchObject({
      code: "UNEXPECTED",
    });
  });
});
