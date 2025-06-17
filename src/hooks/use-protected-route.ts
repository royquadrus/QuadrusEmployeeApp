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
        if (!isLoading && bootstrapped && !user) {
            router.replace(redirectTo)
        }
    }, [user, isLoading, redirectTo, router, bootstrapped])

    return { isLoading, bootstrapped, user, shouldBlock }
}