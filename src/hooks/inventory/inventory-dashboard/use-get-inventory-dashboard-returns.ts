import { DashboardInventoryReturn } from "@/lib/validation/inventory-dashboard";
import { useQuery } from "@tanstack/react-query"

export const useGetInventoryDashboardReturns = () => {
    return useQuery<DashboardInventoryReturn[]>({
        queryKey: ["dashboard-inventory-return"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-dashboard/get-todays-inventory-returns");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory returns");
            }

            const data = await response.json();

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}