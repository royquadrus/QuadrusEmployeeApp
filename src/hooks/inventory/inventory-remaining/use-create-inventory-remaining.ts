import { CreateInventoryRemainingInput } from "@/lib/validation/inventory-remaining";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateInventoryRemaining() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateInventoryRemainingInput) => {
            const response = await fetch("/api/inventory/inventory-remaining/create-inventory-remaining", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to create inventory remaining");

            return data;
        },
        onSuccess: () => {
            toast.success("Inventory remaining created");
            queryClient.invalidateQueries({ queryKey: ["inventory-remaining"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-inventory-usage"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-inventory-stats"] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to create inventory remaining");
        },
    });
}