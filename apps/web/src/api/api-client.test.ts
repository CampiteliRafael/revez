
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from './api-client';

describe('ApiClient', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();

        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should make a GET request with query parameters', async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({ userId: '123' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        const result = await api.get<{ userId: string }>('/users', {
            params: {
                page: 1,
                active: true,
            },
        });

        expect(result).toEqual({
            userId: '123',
        });

        expect(fetchMock).toHaveBeenCalledOnce();

        const [url, options] = fetchMock.mock.calls[0] as [
            URL,
            RequestInit,
        ];

        expect(url.toString()).toBe(
            'http://localhost:3000/api/users?page=1&active=true'
        );

        expect(options.method).toBe('GET');
    });

    it('should include the access token when the request is authenticated', async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({ userId: '123' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        );

        const getAccessToken = vi.fn().mockResolvedValue('test-access-token');

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken,
        });

        await api.get('/me', {
            authenticated: true,
        });

        expect(getAccessToken).toHaveBeenCalledOnce();

        const [, options] = fetchMock.mock.calls[0] as [
            URL,
            RequestInit,
        ];

        const headers = new Headers(options.headers);

        expect(headers.get('Authorization')).toBe(
            'Bearer test-access-token'
        );
    });


    it('should serialize the request body as JSON', async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({ id: '123', status: 'NEW' }),
                {
                    status: 201,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        const input = {
            title: 'Desenvolvimento de site',
            description: 'Criar uma página institucional',
        };

        await api.post('/requests', input);

        const [, options] = fetchMock.mock.calls[0] as [
            URL,
            RequestInit,
        ];

        expect(options.method).toBe('POST');

        expect(options.headers).toBeInstanceOf(Headers);

        const headers = options.headers as Headers;

        expect(headers.get('Content-Type')).toBe('application/json');

        expect(options.body).toBe(JSON.stringify(input));
    });


    it('should throw a NETWORK ApiError when the request fails', async () => {
        fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        await expect(
            api.get('/users')
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 0,
            code: 'NETWORK',
            message: 'Não foi possível conectar à API',
        });

        expect(fetchMock).toHaveBeenCalledOnce();
    });


    it('should throw an ApiError with details when the API returns an HTTP error', async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({
                    message: 'Solicitação não encontrada',
                    code: 'REQUEST_NOT_FOUND',
                    details: {
                        requestId: '123',
                    },
                }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        await expect(
            api.get('/requests/123')
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 404,
            code: 'REQUEST_NOT_FOUND',
            message: 'Solicitação não encontrada',
            details: {
                requestId: '123',
            },
        });
    });


    it('should throw an INVALID_RESPONSE ApiError when the API returns invalid JSON', async () => {
        fetchMock.mockResolvedValue(
            new Response(
                '{"userId":',
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        await expect(
            api.get('/users/123')
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 200,
            code: 'INVALID_RESPONSE',
            message: 'A API retornou uma resposta inválida.',
        });
    });


    it('should return undefined when the API responds with 204 No Content', async () => {
        fetchMock.mockResolvedValue(
            new Response(null, {
                status: 204,
            })
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        const result = await api.delete('/requests/123');

        expect(result).toBeUndefined();
        expect(fetchMock).toHaveBeenCalledOnce();
    });


    it('should throw an AUTH_TOKEN ApiError when token retrieval fails', async () => {
        const getAccessToken = vi.fn().mockRejectedValue(
            new Error('Token unavailable')
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken,
        });

        await expect(
            api.get('/me', {
                authenticated: true,
            })
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 401,
            code: 'AUTH_TOKEN',
            message: 'Não foi possível obter um token válido. Verifique sua sessão.',
        });

        expect(getAccessToken).toHaveBeenCalledOnce();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should throw an INVALID_REQUEST ApiError when body serialization fails', async () => {
        const circularBody: Record<string, unknown> = {};
        circularBody.self = circularBody;

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        await expect(
            api.post('/requests', circularBody)
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 0,
            code: 'INVALID_REQUEST',
            message: 'Não foi possível serializar os dados da requisição.',
        });

        expect(fetchMock).not.toHaveBeenCalled();
    });


    it('should handle HTTP errors with a non-JSON response', async () => {
        fetchMock.mockResolvedValue(
            new Response('Internal Server Error', {
                status: 500,
                headers: {
                    'Content-Type': 'text/plain',
                },
            })
        );

        const api = createApiClient({
            baseURL: 'http://localhost:3000/api',
            getAccessToken: vi.fn(),
        });

        await expect(
            api.get('/users')
        ).rejects.toMatchObject({
            name: 'ApiError',
            status: 500,
            message: 'Erro ao realizar requisição',
        });
    });

});
