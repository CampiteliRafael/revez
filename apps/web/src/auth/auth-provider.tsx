'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { keycloak } from './keycloak';

type AuthContextValue = {
    initialized: boolean;
    authenticated: boolean;
    error: Error | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

let initialization: Promise<boolean> | undefined;

function initializeKeycloak() {
    if (!initialization) {
        initialization = keycloak.init({
            onLoad: 'check-sso',
            pkceMethod: 'S256',
        });
    }
    return initialization;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        void initializeKeycloak()
            .then((isAuthenticated) => {
                if (mounted) {
                    setAuthenticated(isAuthenticated);
                    setInitialized(true);
                }
            })
            .catch((cause: unknown) => {
                if (mounted) {
                    setError(
                        cause instanceof Error ? cause : new Error("Falha ao iniciar Keycloak")
                    );
                    setInitialized(true);
                };
            });
        return () => {
            mounted = false;
        }

    }, []);

    const value: AuthContextValue = {
        initialized,
        authenticated,
        error,
        login: () => keycloak.login({
            redirectUri: window.location.origin
        }),
        logout: () => keycloak.logout({
            redirectUri: window.location.origin
        }),
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};