import { GetInventoryOrderItems, GetInventoryOrderItemsSchema } from "@/lib/validation/inventory-order";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryOrderItems(orderId: number | undefined) {
    return useQuery<GetInventoryOrderItems>({
        queryKey: ["inventory-order-items", orderId],
        queryFn: async ({ queryKey }) => {
            const orderId = queryKey[1] as number;

            if (!orderId) throw new Error("Missing orderId");

            const response = await fetch("/api/inventory/inventory-orders/get-inventory-order-items", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ orderId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory order items");
            }

            const data = await response.json();
            const parsed = GetInventoryOrderItemsSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory order item data");
            }

            return parsed.data;
        },
        enabled: typeof orderId === "number" && orderId > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}