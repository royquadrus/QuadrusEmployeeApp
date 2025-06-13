import { useState } from "react";
import { toast } from "sonner";
import { ResetPasswordFormData } from "@/lib/validation/auth";
import { createClientSupabaseClient } from "@/lib/supabase/client";

interface UseAuthReset {
    isLoading: boolean;
    resetPassword: (data: ResetPasswordFormData) => Promise<void>;
}

export function useAuthReset(): UseAuthReset {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClientSupabaseClient();

    async function resetPassword(data: ResetPasswordFormData) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });

            if (error) throw new Error(error.message);

            toast.success("Password reset link sent. Check your email.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to send reset email.");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, resetPassword };
}