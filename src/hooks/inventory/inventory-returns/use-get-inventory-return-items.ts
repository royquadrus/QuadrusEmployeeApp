import { GetInventoryReturnItems, GetInventoryReturnItemsSchema } from "@/lib/validation/inventory-return";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryReturnItems(returnId: number | undefined) {
    return useQuery<GetInventoryReturnItems>({
        queryKey: ["inventory-return-items", returnId],
        queryFn: async ({ queryKey }) => {
            const returnId = queryKey[1] as number;

            if (!returnId) throw new Error("Missing returnId");

            const response = await fetch("/api/inventory/inventory-returns/get-inventory-return-items", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ returnId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory return items");
            }

            const data = await response.json();
            const parsed = GetInventoryReturnItemsSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory return item data");
            }

            return parsed.data;
        },
        enabled: typeof returnId === "number" && returnId > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}