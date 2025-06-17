import { DashboardInventoryOrder } from "@/lib/validation/inventory-dashboard";
import { useQuery } from "@tanstack/react-query"

export const useGetInventoryDashboardOrders = () => {
    return useQuery<DashboardInventoryOrder[]>({
        queryKey: ["dashboard-inventory-order"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-dashboard/get-todays-inventory-orders");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory orders");
            }

            const data = await response.json();

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}