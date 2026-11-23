import type { CreateRequestInput } from "@revez/contracts";
import type { ApiClient } from "./api-client";
import { ApiError } from "./api-error";

export type CreateRequestResponse = {
  id: string;
  status: "NEW";
};

export type CreateRequestErrorCode =
  "NETWORK" | "UNAUTHORIZED" | "VALIDATION" | "SERVER" | "UNEXPECTED";

export class CreateRequestError extends Error {
  constructor(readonly code: CreateRequestErrorCode) {
    super(code);
    this.name = "CreateRequestError";
  }
}

export async function createRequest(
  api: ApiClient,
  input: CreateRequestInput,
): Promise<CreateRequestResponse> {
  let data: unknown;

  try {
    data = await api.post<unknown>("/requests", input, {
      authenticated: true,
    });
  } catch (cause: unknown) {
    if (cause instanceof ApiError) {
      if (cause.code === "NETWORK" || cause.status === 0) {
        throw new CreateRequestError("NETWORK");
      }

      if (cause.status === 400 || cause.status === 422) {
        throw new CreateRequestError("VALIDATION");
      }

      if (cause.status >= 500) {
        throw new CreateRequestError("SERVER");
      }
      if (
        cause.code === "AUTH_TOKEN" ||
        cause.status === 401 ||
        cause.status === 403
      ) {
        throw new CreateRequestError("UNAUTHORIZED");
      }
    }

    throw new CreateRequestError("UNEXPECTED");
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    typeof data.id !== "string" ||
    !("status" in data) ||
    data.status !== "NEW"
  ) {
    throw new CreateRequestError("UNEXPECTED");
  }

  return {
    id: data.id,
    status: data.status,
  };
}
