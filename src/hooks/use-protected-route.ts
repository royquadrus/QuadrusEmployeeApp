import { useAuthStore } from "@/lib/stores/use-auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface UseProtectedRouteOptions {
    redirectTo?: string
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
    const { redirectTo = '/login' } = options
    const { user, isLoading, bootstrapped } = useAuthStore()
    const router = useRouter()

    const shouldBlock = isLoading || !bootstrapped || !user;

    useEffect(() => {
        if (!bootstrapped || isLoading) return;

        if (!user) {
            const timeout = setTimeout(() => {
                router.replace(redirectTo)
            }, 50);
            //router.replace(redirectTo)

            return () => clearTimeout(timeout);
        }
    }, [user, isLoading, redirectTo, router, bootstrapped])

    return { isLoading, bootstrapped, user, shouldBlock }
}