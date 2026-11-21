'use client';

import { useState } from 'react';
import { CreateRequestForm } from "../../../features/requests/components/create-request-form";
import { Dialog } from "../../../features/requests/components/ui/dialog";
import { getCurrentUser, type CurrentUser } from '../../../api/me';
import type { CreateRequestInput } from '@revez/contracts';
import { createRequest } from '../../../api/requests';
import { useAuth } from '../../../auth/auth-provider';
import { useApi } from '../../../api/use-api';

export default function RequestsPage() {
    const { logout, getAccessToken } = useAuth();
    const [profileLoading, setProfileLoading] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const api = useApi();

    async function handleLoadProfile() {
        setActionError(null);
        setProfileLoading(true);

        try {
            const user = await getCurrentUser(api);
            setCurrentUser(user);
        } catch (err) {
            setActionError(
                err instanceof Error ? err.message : "Não foi possível carregar o perfil",
            );
        } finally {
            setProfileLoading(false);
        }
    }

    function handleCreateRequest(input: CreateRequestInput) {
        return createRequest(api, input);
    }

    async function handleLogout() {
        setActionError(null);
        try {
            await logout();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer logout');
        }
    }

    return (
        <main>
            <h1>Solicitações</h1>
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
