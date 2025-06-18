import { InventoryOrder, InventoryOrderSchema } from "@/lib/validation/inventory-order";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryOrder(orderId: number | undefined) {
    return useQuery<InventoryOrder>({
        queryKey: ["inventory-order", orderId],
        queryFn: async ({ queryKey }) => {
            const orderId = queryKey[1] as number;

            if (!orderId) throw new Error("Missing orderId");

            const response = await fetch("/api/inventory/inventory-orders/get-inventory-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory order");
            }

            const data = await response.json();
            const parsed = InventoryOrderSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory order data");
            }

            return parsed.data;
        },
        enabled: typeof orderId === "number" && orderId > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}