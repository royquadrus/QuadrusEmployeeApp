import { GetInventoryReturns, GetInventoryReturnSchema } from "@/lib/validation/inventory-return";
import { useQuery } from "@tanstack/react-query";

export const useGetInventoryReturns = () => {
    return useQuery<GetInventoryReturns>({
        queryKey: ["inventory-returns"],
        queryFn: async () => {
            const response = await fetch("/api/inventory/inventory-returns/list-inventory-returns");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.data || "Failed to fetch inventory returns");
            }

            const data = await response.json();
            const parsed = GetInventoryReturnSchema.safeParse(data);

            if (!parsed.success) {
                console.error(parsed.error);
                throw new Error("Invalid inventory return data");
            }
            
            return parsed.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}