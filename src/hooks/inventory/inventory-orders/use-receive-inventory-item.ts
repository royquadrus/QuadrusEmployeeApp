import { ReceiveInventoryInput } from "@/lib/validation/inventory-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useReceiveInventoryItem(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { inventory_order_id: number } & ReceiveInventoryInput) => {
            const response = await fetch("/api/inventory/inventory-orders/receive-item", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to receive inventory item");

            return data;
        },
        onMutate: async (variables) => {
            const { inventory_order_id, inventory_order_item_id, quantity_received } = variables;

            await queryClient.cancelQueries({ queryKey: ["inventory-order-items", inventory_order_id ] });

            const previousItems = queryClient.getQueriesData<ReceiveInventoryInput[]>({
                queryKey: ["inventory-order-items", inventory_order_id],
            });

            queryClient.setQueryData<ReceiveInventoryInput[]>(
                ["inventory-order-items", inventory_order_id],
                (old = []) =>
                    old.map((item) =>
                    item.inventory_order_item_id === inventory_order_item_id
                        ? { ...item, quantity_received }
                        : item
                )
            );

            return { previousItems };
        },
        onError: (error, variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(
                    ["inventory-order-items", variables.inventory_order_item_id],
                    context.previousItems
                );
            }

            toast.error( error instanceof Error ? error.message : "Failed to receive inventory item");
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["inventory-order-items", variables.inventory_order_id],
            });
        },
        onSuccess: (data) => {
            toast.success("Inventory item received");
            queryClient.invalidateQueries({ queryKey: ["inventory-order-items", data.inventory_order_id] });
        },
    });
}