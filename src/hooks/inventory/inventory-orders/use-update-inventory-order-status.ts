import { UpdateInventoryOrderInput } from "@/lib/validation/inventory-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateInventoryOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateInventoryOrderInput) => {
            const response = await fetch("/api/inventory/inventory-orders/update-inventory-order-status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update inventory order status");

            return data;
        },
        onSuccess: (data) => {
            toast.success("Inventory order status updated");
            queryClient.invalidateQueries({ queryKey: ["inventory-order", data.inventory_order_id] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update inventory order status");
        },
    });
}