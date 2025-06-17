import { DashboardMonthlyUsage } from "@/lib/validation/inventory-dashboard";
import { useQuery } from "@tanstack/react-query"

export const useGetMonthlyInventoryUsage = () => {
    return useQuery<DashboardMonthlyUsage>({
        queryKey: ["monthly-inventory-usage"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-dashboard/get-mtd-usage");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch monthly usage");
            }

            const data = await response.json();

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}