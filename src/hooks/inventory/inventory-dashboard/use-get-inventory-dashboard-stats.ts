import { DashboardInventoryStats } from "@/lib/validation/inventory-dashboard";
import { useQuery } from "@tanstack/react-query"

export const useGetInventoryDashboardStats = () => {
    return useQuery<DashboardInventoryStats>({
        queryKey: ["dashboard-inventory-stats"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-dashboard/get-inventory-stats");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory stats");
            }

            const data = await response.json();

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}