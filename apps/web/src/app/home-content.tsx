'use client';

import { useState } from 'react';
import { useAuth } from '../auth/auth-provider';

export function HomeContent() {
    const { initialized, authenticated, error, login, logout } = useAuth();
    const [actionError, setActionError] = useState<string | null>(null);

    async function handleLogin() {
        setActionError(null);
        try {
            await login();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer login');
        }
    };

    async function handleLogout() {
        setActionError(null);
        try {
            await logout();
        }
        catch (err) {
            setActionError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer logout');
        }
    };

    if (!initialized) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro ao inicializar autenticação: {error.message}</p>;
    }

    if (!authenticated) {
        return (
            <main>
                <h1>Bem-vindo ao Revez</h1>
                <p>Gestão de solicitações da sua empresa.</p>
                <button type="button" onClick={handleLogin}>
                    Entrar
                </button>
                {actionError && <p role="alert">{actionError}</p>}
            </main>
        );
    }

    return (
        <main>
            <h1>Bem-vindo ao Revez</h1>
            <p>Gestão de solicitações da sua empresa.</p>
            <button type="button" onClick={handleLogout}>
                Sair
            </button>
            {actionError && <p role="alert">{actionError}</p>}
        </main>
    );
}
