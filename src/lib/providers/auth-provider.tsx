"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/use-auth-store";
import { createClientSupabaseClient } from "../supabase/client";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading, setEmployee } = useAuthStore();
    const supabase = createClientSupabaseClient();
    const initialized = useRef(false);

    useEffect(() => {
        //Prevent multiple initializations
        if (initialized.current) return;
        initialized.current = true;

        const fetchEmployeeData = async (userId: string) => {
            const { data, error } = await supabase
                .from("hr_employees")
                .select("employee_id, first_name, last_name, email")
                .eq("user_id", userId)
                .maybeSingle();

            //console.log("Auth Provider employee:", data);

            if (error) {
                console.error("Failed to fetch employee:", error.message);
            } else if (data) {
                setEmployee(data);
            } else {
                console.warn("No matching employee record found for user ID:", userId);
                setEmployee(null);
            }
        };

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;

                if (session) {
                    setUser(session.user);
                    await fetchEmployeeData(user.id);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_, session) => {
            const user = session?.user ?? null;
            setUser(user);
            //setUser(session?.user ?? null);
            if (user) {
                await fetchEmployeeData(user.id);
            } else {
                setEmployee(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setLoading, setUser, setEmployee, supabase]);

    return <>{children}</>
}