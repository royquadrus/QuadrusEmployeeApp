import { GetInventoryOrders, GetInventoryOrdersSchema } from "@/lib/validation/inventory-order"
import { useQuery } from "@tanstack/react-query"

export const useGetInventoryOrders = () => {
    return useQuery<GetInventoryOrders>({
        queryKey: ["inventory-orders"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-orders/list-inventory-orders");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.data || "Failed to fetch inventory orders");
            }

            const data = await response.json();
            const parsed = GetInventoryOrdersSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory order data");
            }
            
            return parsed.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}