"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../auth/auth-provider";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { initialized, authenticated, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !error && !authenticated) {
      router.replace("/");
    }
  }, [initialized, error, authenticated, router]);

  if (!initialized) {
    return <p role="status">Verificando autenticação...</p>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">
          Não foi possível verificar sua sessão. Atualize a página ou tente
          novamente.
        </p>
      </main>
    );
  }

  if (!authenticated) {
    return <p role="status">Redirecionando para a página inicial...</p>;
  }

  return (
    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <p className={styles.workspaceTitle}>Área de trabalho</p>
        <nav aria-label="Navegação principal">
          <Link
            className={styles.navLink}
            href="/app/solicitacoes"
            aria-current="page"
          >
            Solicitações
          </Link>
        </nav>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
