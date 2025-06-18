import { CreateInventoryUsedInput } from "@/lib/validation/inventory-used";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateInventoryUsed() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateInventoryUsedInput) => {
            const response = await fetch("/api/inventory/inventory-used/create-inventory-used", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to create inventory used");

            return data;
        },
        onSuccess: () => {
            toast.success("Inventory used created");
            queryClient.invalidateQueries({ queryKey: ["inventory-used"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-inventory-usage"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-inventory-stats"] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to create inventory used entry");
        },
    });
}