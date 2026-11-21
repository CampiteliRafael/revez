'use client';

import { useMemo } from 'react';
import { useAuth } from '../auth/auth-provider';
import { createApiClient } from './api-client';

export function useApi() {
    const { getAccessToken } = useAuth();
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    if (!baseURL) {
        throw new Error('API URL is not defined');
    }

    return useMemo(
        () =>
            createApiClient({
                baseURL,
                getAccessToken,
            }),
        [baseURL, getAccessToken]
    );
}
