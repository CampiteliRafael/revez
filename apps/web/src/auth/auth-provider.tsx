'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { keycloak } from './keycloak';

type AuthContextValue = {
    initialized: boolean;
    authenticated: boolean;
    error: Error | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string>;
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

async function getAccessToken(): Promise<string> {
    if (!keycloak.authenticated) {
        throw new Error("Usuário não autenticado");
    }
    await keycloak.updateToken(30);

    if (!keycloak.token) {
        throw new Error("Access token indisponível");
    }
    return keycloak.token;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const handleAuthSuccess = () => {
            if (mounted) {
                setAuthenticated(true);
            }
        };

        const handleAuthLogout = () => {
            if (mounted) {
                setAuthenticated(false);
            }
        };

        keycloak.onAuthSuccess = handleAuthSuccess;
        keycloak.onAuthLogout = handleAuthLogout;

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

            if (keycloak.onAuthSuccess === handleAuthSuccess) {
                delete keycloak.onAuthSuccess;
            }

            if (keycloak.onAuthLogout === handleAuthLogout) {
                delete keycloak.onAuthLogout
            }
        };

    }, []);

    const value: AuthContextValue = {
        initialized,
        authenticated,
        error,
        login: () => keycloak.login({
            redirectUri: `${window.location.origin}/app/solicitacoes`
        }),
        logout: () => keycloak.logout({
            redirectUri: `${window.location.origin}/`
        }),
        getAccessToken,
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