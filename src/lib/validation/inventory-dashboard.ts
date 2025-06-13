import { z } from "zod";

export const DashboardInventoryOrderSchema = z.object({
    inventory_order_id: z.number(),
    order_number: z.string(),
    supplier: z.string(),
});

export const DashboardInventoryReturnSchema = z.object({
    inventory_return_id: z.number(),
    return_number: z.string(),
    supplier: z.string(),
});

export type DashboardInventoryOrder = z.infer<typeof DashboardInventoryOrderSchema>;
export type DashboardInventoryReturn = z.infer<typeof DashboardInventoryReturnSchema>;