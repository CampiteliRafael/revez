"use client";

import { useAuth } from "../../../auth/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LoginPage() {
  const { login, initialized, authenticated, error } = useAuth();
  const router = useRouter();

  const loginStarted = useRef(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized || error) {
      return;
    }

    if (authenticated) {
      router.replace("/app/solicitacoes");
      return;
    }

    if (loginStarted.current) {
      return;
    }

    loginStarted.current = true;

    login().catch((err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível iniciar a autenticação.";

      setActionError(message);
    });
  }, [initialized, authenticated, error, login, router]);

  if (!initialized) {
    return (
      <main>
        <p role="status">Preparando seu acesso ao Revez...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p role="alert">Não foi possível inicializar a autenticação.</p>
      </main>
    );
  }

  if (actionError) {
    return (
      <main>
        <p role="alert">{actionError}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  if (authenticated) {
    return <p role="status">Redirecionando para o Revez...</p>;
  }

  return (
    <main>
      <p role="status">
        Você está sendo direcionado para o ambiente seguro de autenticação...
      </p>
    </main>
  );
}
