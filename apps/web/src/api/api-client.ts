import type { RequestOptions } from './api-types';

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
