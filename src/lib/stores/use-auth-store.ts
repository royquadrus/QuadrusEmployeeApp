import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EmployeeInfo {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    employee: EmployeeInfo | null;
    isLoading: boolean;
    bootstrapped: boolean;
    setUser: (user: User | null) => void;
    setEmployee: (employee: EmployeeInfo | null) => void;
    setLoading: (isLoading: boolean) => void
    setBootstrapped: (value: boolean | ((prev: boolean) => boolean)) => void;
    clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set): AuthState => ({
            user: null,
            employee: null,
            isLoading: false,
            bootstrapped: false,
            setUser: (user) => set({ user }),
            setEmployee: (employee) => set({ employee }),
            setLoading: (isLoading) => set({ isLoading }),
            //setBootstrapped: (bootstrapped) => set({ bootstrapped }),
            setBootstrapped: (valueOrUpdater) =>
                set((state) => ({
                    bootstrapped:
                        typeof valueOrUpdater === "function"
                            ? valueOrUpdater(state.bootstrapped)
                            : valueOrUpdater,
                })),
            clearSession: () => {
                set({
                    user: null,
                    employee: null,
                    isLoading: false,
                    bootstrapped: false,
                });
                sessionStorage.removeItem("auth-storage");
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                employee: state.employee,
                bootstrapped: state.bootstrapped,
            }),
        }
    )
);