import type { CreateRequestInput } from "@revez/contracts";

export type CreateRequestResponse = {
    id: string;
    status: "NEW";
};

export type CreateRequestErrorCode =
    | "NETWORK"
    | "UNAUTHORIZED"
    | "VALIDATION"
    | "SERVER"
    | "UNEXPECTED";

export class CreateRequestError extends Error {
    constructor(readonly code: CreateRequestErrorCode) {
        super(code);
        this.name = "CreateRequestError";
    }
}

export async function createRequest(
    input: CreateRequestInput,
    accessToken: string,
): Promise<CreateRequestResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error("API URL is not defined");
    }

    const response = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        if (response.status === 400 || response.status === 422) {
            throw new CreateRequestError("VALIDATION");
        }

        if (response.status === 401 || response.status === 403) {
            throw new CreateRequestError("UNAUTHORIZED");
        }

        if (response.status >= 500) {
            throw new CreateRequestError("SERVER");
        }

        throw new CreateRequestError("UNEXPECTED");
    }

    let data: unknown;
    try {
        data = await response.json();
    } catch {
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

    return { id: data.id, status: data.status };
};