"use client";

import { useAuthStore } from "@/lib/stores/use-auth-store";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export function AuthBootstrapper({ children }: { children: React.ReactNode }) {
  const supabase = createClientSupabaseClient();
  const {
    setUser,
    setEmployee,
    setLoading,
    setBootstrapped,
    clearSession,
    bootstrapped,
  } = useAuthStore();

  useEffect(() => {
    if (bootstrapped) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          const { data: employee, error } = await supabase
            .from("hr_employees")
            .select("employee_id, first_name, last_name, email")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) {
            console.error("Failed to fetch employee:", error.message);
          }

          setEmployee(employee ?? null);
        } else {
          setEmployee(null);
        }
      } catch (err) {
        console.error("Auth bootstrap error:", err);
        clearSession();
      } finally {
        setBootstrapped(true);
        setLoading(false);
      }
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        const { data: employee } = await supabase
          .from("hr_employees")
          .select("employee_id, first_name, last_name, email")
          .eq("user_id", user.id)
          .maybeSingle();

        setEmployee(employee ?? null);
      } else {
        setEmployee(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [bootstrapped, supabase, setUser, setEmployee, setLoading, setBootstrapped, clearSession]);

  if (!bootstrapped) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}