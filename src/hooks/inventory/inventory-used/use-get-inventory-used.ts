import { InventoryUsed } from "@/lib/validation/inventory-used";
import { useQuery } from "@tanstack/react-query"

export const useGetInventoryUsed = () => {
    return useQuery<InventoryUsed[]>({
        queryKey: ["inventory-used"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-used/get-inventory-used");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory used");
            }

            const data = await response.json();

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}