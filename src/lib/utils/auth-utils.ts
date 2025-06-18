import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/use-auth-store";
import { createClientSupabaseClient } from "../supabase/client";
import { useCallback } from "react";

export function useSignOut() {
    const router = useRouter();
    const { setLoading, clearSession } = useAuthStore();
    const supabase = createClientSupabaseClient();

    const signOut = useCallback(async () => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Supabase signout error:", error.message);
            }
        } catch (err) {
            console.error("Unexpected error signing out:", err);
        } finally {
            clearSession();
            setLoading(false);
            router.replace("/login");
        }
    }, [supabase, clearSession, setLoading, router]);

    return signOut;
}

export function useAuthSession() {
    const { user, employee, isLoading, bootstrapped } = useAuthStore();

    const session = user ? { user, employee } : null;

    return {
        session,
        user,
        employee,
        isLoading,
        bootstrapped,
    };
}