import { createClientSupabaseClient } from "@/lib/supabase/client";
import { RegisterFormData } from "@/lib/validation/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseAuthRegister {
    isLoading: boolean;
    register: (data: RegisterFormData) => Promise<void>;
}

export function UseAuthRegister(): UseAuthRegister {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClientSupabaseClient();

    async function register(data: RegisterFormData) {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (error) throw new Error(error.message);

            toast.success('Check your email to confirm your registration');

            router.push("/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to register");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, register };
}