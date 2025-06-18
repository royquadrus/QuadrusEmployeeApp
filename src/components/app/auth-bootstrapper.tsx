"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { PayPeriodSchema } from "@/lib/validation/timeclock";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

export function AuthBootstrapper({ children }: {children: React.ReactNode }) {
    const supabase = createClientSupabaseClient();
    const {
        setUser,
        setEmployee,
        setLoading,
        setBootstrapped,
        clearSession,
        bootstrapped,
    } = useAuthStore();

    const {
        setCurrentPayPeriod,
        setSelectedPayPeriod,
        setCurrentTimesheet,
    } = useTimeclockSessionStore();

    const sessionRef = useRef<string | null>(null);

    const { shouldBlock } = useProtectedRoute({ redirectTo: "/login" });

    useEffect(() => {
        //if (bootstrapped) return;
        /*const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setBootstrapped((prev) => {
                    if (prev) return false;
                    return prev;
                });
            } else {
                clearSession();
                setBootstrapped(true);
            }
        });*/
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUserId = session?.user?.id ?? null;

            if (sessionRef.current !== newUserId) {
                sessionRef.current = newUserId;

                if (newUserId) {
                    setBootstrapped(false);
                } else {
                    clearSession();
                    setBootstrapped(true);
                }
            }
        });

        if (!bootstrapped) {
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

                        if (error) console.error("Failed to fetch employee:", error.message);
                        setEmployee(employee ?? null);

                        if (employee?.employee_id) {
                            const today = new Date().toISOString().split("T")[0];

                            const { data: payPeriod, error: ppError } = await supabase
                                .from("hr_pay_periods")
                                .select("*")
                                .lte("start_date", today)
                                .gte("end_date", today)
                                .maybeSingle();

                            if (ppError) throw ppError;

                            const parsedPayPeriod = PayPeriodSchema.parse(payPeriod);

                            setCurrentPayPeriod(parsedPayPeriod ?? null);
                            setSelectedPayPeriod(parsedPayPeriod ?? null);

                            const { data: existingTimesheet, error: tsError } = await supabase
                                .from("hr_timesheets")
                                .select("timesheet_id, pay_period_id, status")
                                .eq("employee_id", employee.employee_id)
                                .eq("pay_period_id", parsedPayPeriod?.pay_period_id ?? "")
                                .maybeSingle();

                            if (tsError) throw error;

                            let timesheet = existingTimesheet;

                            if (!timesheet) {
                                const { data: inserted, error: insertError } = await supabase
                                    .from("hr_timesheets")
                                    .insert({
                                        employee_id: employee.employee_id,
                                        pay_period_id: parsedPayPeriod.pay_period_id,
                                        status: "Open",
                                    })
                                    .select("timesheet_id, pay_period_id, status")
                                    .single();

                                if (insertError) throw insertError;

                                timesheet = inserted;
                            }

                            setCurrentTimesheet(timesheet ?? null);
                        } else {
                            setEmployee(null);
                            setCurrentPayPeriod(null);
                            setSelectedPayPeriod(null);
                            setCurrentTimesheet(null);
                        }
                    }
                } catch (err) {
                    console.log("Auth bootstrap error:", err);
                    clearSession();
                } finally {
                    setBootstrapped(true);
                    setLoading(false);
                }
            };

            load();
        }

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [
        bootstrapped,
        supabase,
        setUser,
        setEmployee,
        setLoading,
        setBootstrapped,
        clearSession,
        setCurrentPayPeriod,
        setSelectedPayPeriod,
        setCurrentTimesheet,
    ]);
        /*const load = async () => {
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

                    if (error) console.error("Failed to fetch employee:", error.message);
                    setEmployee(employee ?? null);

                    if (employee?.employee_id) {
                        const today = new Date().toISOString().split("T")[0];

                        const { data: payPeriod, error: ppError } = await supabase
                            .from("hr_pay_periods")
                            .select("*")
                            .lte("start_date", today)
                            .gte("end_date", today)
                            .maybeSingle();

                        if (ppError) throw ppError;

                        const parsedPayPeriod = PayPeriodSchema.parse(payPeriod);

                        setCurrentPayPeriod(parsedPayPeriod ?? null);
                        setSelectedPayPeriod(parsedPayPeriod ?? null);

                        const { data: existingTimesheet, error: tsError } = await supabase
                            .from("hr_timesheets")
                            .select("timesheet_id, pay_period_id, status")
                            .eq("employee_id", employee.employee_id)
                            .eq("pay_period_id", parsedPayPeriod?.pay_period_id ?? "")
                            .maybeSingle();

                        if (tsError) throw error;

                        let timesheet = existingTimesheet;

                        if (!timesheet) {
                            const { data: inserted, error: insertError } = await supabase
                                .from("hr_timesheets")
                                .insert({
                                    employee_id: employee.employee_id,
                                    pay_period_id: parsedPayPeriod.pay_period_id,
                                    status: "Open",
                                })
                                .select("timesheet_id, pay_period_id, status")
                                .single();

                            if (insertError) throw insertError;

                            timesheet = inserted;
                        }

                        setCurrentTimesheet(timesheet ?? null);
                    } else {
                        setEmployee(null);
                        setCurrentPayPeriod(null);
                        setSelectedPayPeriod(null);
                        setCurrentTimesheet(null);
                    }
                }
            } catch (err) {
                console.error("Auth bootstrap error:", err);
                clearSession();
            } finally {
                setBootstrapped(true);
                setLoading(false);
            }
        }
        
        load();
    }, [
        bootstrapped,
        supabase,
        setUser,
        setEmployee,
        setLoading,
        setBootstrapped,
        clearSession,
        setCurrentPayPeriod,
        setSelectedPayPeriod,
        setCurrentTimesheet,
    ]);*/

    if (!bootstrapped || shouldBlock) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="animate-spin" />    
            </div>
        );
    }

    return <>{children}</>;
}