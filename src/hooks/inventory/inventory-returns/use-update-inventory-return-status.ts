import { UpdateInventoryReturnInput } from "@/lib/validation/inventory-return";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateInventoryReturnStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateInventoryReturnInput) => {
            const response = await fetch("/api/inventory/inventory-returns/update-inventory-return-status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update inventory return status");

            return data;
        },
        onSuccess: (data) => {
            toast.success("Inventory return status updated");
            queryClient.invalidateQueries({ queryKey: ["inventory-return", data.inventory_return_id] });
            queryClient.invalidateQueries({ queryKey: ["inventory-returns"] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update inventory return status");
        },
    });
}