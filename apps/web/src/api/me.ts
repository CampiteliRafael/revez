export type CurrentUser = {
    userId: string;
    groups: string[];
};

export async function getCurrentUser(accessToken: string): Promise<CurrentUser> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error("API URL is not defined");
    }

    const response = await fetch(`${apiUrl}/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch API (HTTP ${response.status})`);
    }

    const data: unknown = await response.json();


    if (
        typeof data !== "object" ||
        data === null ||
        !("userId" in data) ||
        typeof data.userId !== "string" ||
        !("groups" in data) ||
        !Array.isArray(data.groups) ||
        !data.groups.every((group: unknown) => typeof group === "string")
    ) {
        throw new Error("Resposta inesperada da API");
    }

    return {
        userId: data.userId,
        groups: data.groups,
    };
}