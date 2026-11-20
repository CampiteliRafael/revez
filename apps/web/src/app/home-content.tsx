'use client';

import { useState } from 'react';
import { useAuth } from '../auth/auth-provider';

export function HomeContent() {
    const { initialized, error, login, logout } = useAuth();
    const [actionError, setActionError] = useState<string | null>(null);

    async function handleLogin() {
        setActionError(null);
        try {
            await login();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer login');
        }
    };

    if (!initialized) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro ao inicializar autenticação: {error.message}</p>;
    }

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
