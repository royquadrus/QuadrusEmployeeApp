import { ShipInventoryReturnInput } from "@/lib/validation/inventory-return";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useShipInventoryItem(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { inventory_return_id: number } & ShipInventoryReturnInput) => {
            const response = await fetch("/api/inventory/inventory-returns/ship-item", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to ship inventory item");

            return data;
        },
        onMutate: async (variables) => {
            const { inventory_return_id, inventory_return_item_id, quantity_shipped } = variables;

            await queryClient.cancelQueries({ queryKey: ["inventory-return-items", inventory_return_id ] });

            const previousItems = queryClient.getQueriesData<ShipInventoryReturnInput[]>({
                queryKey: ["inventory-return-items", inventory_return_id],
            });

            queryClient.setQueryData<ShipInventoryReturnInput[]>(
                ["inventory-return-items", inventory_return_id],
                (old = []) =>
                    old.map((item) =>
                    item.inventory_return_item_id === inventory_return_item_id
                        ? { ...item, quantity_shipped }
                        : item
                )
            );

            return { previousItems };
        },
        onError: (error, variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(
                    ["inventory-return-items", variables.inventory_return_item_id],
                    context.previousItems
                );
            }

            toast.error( error instanceof Error ? error.message : "Failed to ship inventory item");
        },
        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["inventory-return-items", variables.inventory_return_id],
            });
        },
        onSuccess: (data) => {
            toast.success("Inventory item shipped");
            queryClient.invalidateQueries({ queryKey: ["inventory-return-items", data.inventory_return_id] });
        },
    });
}