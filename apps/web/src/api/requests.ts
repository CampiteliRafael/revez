import type { CreateRequestInput } from "@revez/contracts";

export type CreateRequestResponse = {
    id: string;
    status: "NEW";
};

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
        throw new Error(`Falha ao criar solicitação (HTTP ${response.status})`);
    }

    const data: unknown = await response.json();

    if (
        typeof data !== "object" ||
        data === null ||
        !("id" in data) ||
        typeof data.id !== "string" ||
        !("status" in data) ||
        data.status !== "NEW"
    ) {
        throw new Error("Resposta inesperada da API");
    }

    return { id: data.id, status: data.status };
};