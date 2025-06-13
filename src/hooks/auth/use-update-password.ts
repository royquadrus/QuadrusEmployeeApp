import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export function useUpdatePassword() {
    const supabase = createClientSupabaseClient();
    const [isLoading, setIsLoading] = useState(false);

    const updatePassword = async (newPassword: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) throw new Error(error.message);

            toast.success("Your password has been updated.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update password.");
        } finally {
            setIsLoading(false);
        }
    };

    return { updatePassword, isLoading };
}