import { InventoryReturn, InventoryReturnSchema } from "@/lib/validation/inventory-return";
import { useQuery } from "@tanstack/react-query";

export function useGetInventoryReturn(returnId: number | undefined) {
    return useQuery<InventoryReturn>({
        queryKey: ["inventory-return", returnId],
        queryFn: async ({ queryKey }) => {
            const returnId = queryKey[1] as number;

            if (!returnId) throw new Error("Missing returnId");

            const response = await fetch("/api/inventory/inventory-returns/get-inventory-return", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ returnId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch inventory return");
            }

            const data = await response.json();
            const parsed = InventoryReturnSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory return data");
            }

            return parsed.data;
        },
        enabled: typeof returnId === "number" && returnId > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}