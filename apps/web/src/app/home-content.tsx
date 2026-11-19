'use client';

import { useState } from 'react';
import { useAuth } from '../auth/auth-provider';
import { getCurrentUser, type CurrentUser } from "../api/me";
import { createRequest } from "../api/requests";
import { CreateRequestForm } from "../features/requests/components/create-request-form";
import { Dialog } from "../features/requests/components/ui/dialog";
import type { CreateRequestInput } from "@revez/contracts";

export function HomeContent() {
    const { initialized, authenticated, error, login, logout, getAccessToken } = useAuth();
    const [actionError, setActionError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

    async function handleLoadProfile() {
        setActionError(null);
        setProfileLoading(true);

        try {
            const accessToken = await getAccessToken();
            const user = await getCurrentUser(accessToken);
            setCurrentUser(user);
        } catch (err) {
            setActionError(
                err instanceof Error ? err.message : "Não foi possível carregar o perfil",
            );
        } finally {
            setProfileLoading(false);
        }
    }

    async function handleCreateRequest(input: CreateRequestInput) {
        const accessToken = await getAccessToken();
        return createRequest(input, accessToken);
    }

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
            <section aria-label="Solicitações">
                <button
                    type="button"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    Nova solicitação
                </button>
                <Dialog
                    open={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    labelledBy="create-request-heading"
                    preventClose={isSubmittingRequest}
                >
                    {isCreateDialogOpen && (
                        <CreateRequestForm
                            onSubmit={handleCreateRequest}
                            onCancel={() => setIsCreateDialogOpen(false)}
                            onSubmittingChange={setIsSubmittingRequest}
                        />
                    )}
                </Dialog>
            </section>
            <div>
                <button
                    type="button"
                    onClick={() => void handleLoadProfile()}
                    disabled={profileLoading}
                >
                    {profileLoading ? "Carregando perfil..." : "Consultar perfil na API"}
                </button>

                {currentUser && (
                    <section>
                        <p>Usuário: {currentUser.userId}</p>
                        <p>Grupos: {currentUser.groups.join(", ") || "Nenhum"}</p>
                    </section>
                )}
            </div>
        </main>
    );
}
