import { useAuthStore } from "@/lib/stores/use-auth-store";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { LoginFormData } from "@/lib/validation/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseAuthLogin {
    isLoading: boolean;
    login: (data: LoginFormData) => Promise<void>;
}

export function UseAuthLogin(): UseAuthLogin {
    const { setLoading, isLoading } = useAuthStore();
    const supabase = createClientSupabaseClient();
    const router = useRouter();

    async function login(data: LoginFormData) {
        try {
            setLoading(true);

            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw new Error(error.message);

            toast.success('You have successfully logged in.');

            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to login");
        } finally {
            setLoading(false);
        }
    }

    return { isLoading, login };
}