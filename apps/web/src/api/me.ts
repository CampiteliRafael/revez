import type { ApiClient } from './api-client';

export type CurrentUser = {
    userId: string;
    groups: string[];
};

export async function getCurrentUser(api: ApiClient): Promise<CurrentUser> {
    const data = await api.get<unknown>('/me', {
        authenticated: true,
    });

    if (
        typeof data !== 'object' ||
        data === null ||
        !('userId' in data) ||
        typeof data.userId !== 'string' ||
        !('groups' in data) ||
        !Array.isArray(data.groups) ||
        !data.groups.every((group: unknown) => typeof group === 'string')
    ) {
        throw new Error('Resposta inesperada da API');
    }

    return {
        userId: data.userId,
        groups: data.groups,
    };
}
