import AccountForm from "@/components/auth/account-form";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export default async function Account() {
    const supabase = await createClientSupabaseClient();

    const { 
        data: { user },
    } = await supabase.auth.getUser();

    return <AccountForm user={user} />
}