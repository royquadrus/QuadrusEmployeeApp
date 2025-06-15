"use client";

import { AuthBootstrapper } from "@/components/app/auth-bootstrapper";
import { MainNav } from "@/components/navigation/main-nav";
import { useEnsureDropdownData } from "@/hooks/use-ensure.dropdown-data";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { Loader } from "lucide-react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { shouldBlock, bootstrapped } = useProtectedRoute({ redirectTo: "/login" });
    useEnsureDropdownData();

    return (
        <AuthBootstrapper>
            {!bootstrapped || shouldBlock ? (
                <div className="flex h-screen w-screen items-center justify-center">
                    <Loader className="animate-spin" />
                </div>
            ): (
                <div className="min-h-screen bg-background">
                    <MainNav />
                    <main>{children}</main>
                </div>
            )}
        </AuthBootstrapper>        
    );
}