import type { ReactNode } from "react";
import { AuthProvider } from "../../auth/auth-provider";
import PrivateAppShell from "./PrivateAppShell";

export default function PrivateLayout({
    children
}: { children: ReactNode }) {
    return (
        <AuthProvider>
            <PrivateAppShell>
                {children}
            </PrivateAppShell>
        </AuthProvider>
    );
}