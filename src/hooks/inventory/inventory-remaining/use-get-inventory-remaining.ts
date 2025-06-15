import { InventoryRemaining } from "@/lib/validation/inventory-remaining"
import { useQuery } from "@tanstack/react-query"
import { error } from "console";

export const useGetInventoryRemaining = () => {
    return useQuery<InventoryRemaining[]>({
        queryKey: ["inventory-remaining"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-remaining/get-inventory-remaining");

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to fetch inventory remaining");

            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};