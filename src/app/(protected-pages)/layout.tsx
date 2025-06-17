"use client";

import { AuthBootstrapper } from "@/components/app/auth-bootstrapper";
import { MainNav } from "@/components/navigation/main-nav";
import { useEnsureDropdownData } from "@/hooks/use-ensure.dropdown-data";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useEnsureDropdownData();

    return (
        <AuthBootstrapper>
            <MainNav />
            <main>{children}</main>
        </AuthBootstrapper>        
    );
}