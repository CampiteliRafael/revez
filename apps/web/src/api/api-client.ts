import { ApiError } from './api-error';
import type { ApiClientConfig, RequestOptions } from './api-types';

export interface ApiClient {
    get<T>(path: string, options?: RequestOptions): Promise<T>;

    post<T>(
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T>;

    put<T>(
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T>;

    patch<T>(
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T>;

    delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {

    async function request<T>(
        method: string,
        path: string,
        body?: unknown,
        options: RequestOptions = {}
    ): Promise<T> {

        const url = new URL(
            path.replace(/^\//, ''),
            `${config.baseURL.replace(/\/+$/, '')}/`
        );

        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.set(key, String(value));
            });
        }

        const headers = new Headers(options.headers);

        if (body !== undefined) {
            headers.set('Content-Type', 'application/json');
        }

        if (options.authenticated) {
            const token = await config.getAccessToken();
            headers.set('Authorization', `Bearer ${token}`);
        }

        let response: Response;

        try {
            response = await fetch(url, {
                method,
                headers,
                ...(body !== undefined && {
                    body: JSON.stringify(body)
                }),
            });
        } catch {
            throw new ApiError(
                'Não foi possível conectar à API',
                0,
                'NETWORK'
            );
        }

        const contentType = response.headers.get('content-type');

        let data: unknown = undefined;

        if (response.status !== 204) {
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        }

        if (!response.ok) {
            const errorData =
                typeof data === 'object' && data !== null
                    ? data
                    : {};

            const message =
                'message' in errorData &&
                    typeof errorData.message === 'string'
                    ? errorData.message
                    : 'Erro ao realizar requisição';

            const code =
                'code' in errorData &&
                    typeof errorData.code === 'string'
                    ? errorData.code
                    : undefined;

            const details =
                'details' in errorData
                    ? errorData.details
                    : undefined;

            throw new ApiError(
                message,
                response.status,
                code,
                details
            );
        }

        return data as T;
    }

    return {
        get: <T>(path: string, options?: RequestOptions) =>
            request<T>('GET', path, undefined, options),

        post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>('POST', path, body, options),

        put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>('PUT', path, body, options),

        patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
            request<T>('PATCH', path, body, options),

        delete: <T>(path: string, options?: RequestOptions) =>
            request<T>('DELETE', path, undefined, options),
    };
}
