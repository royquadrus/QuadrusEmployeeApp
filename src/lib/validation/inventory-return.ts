import { z } from "zod";

export const InventoryReturnSchema = z.object({
    inventory_return_id: z.number(),
    return_number: z.string(),
    status: z.enum(["Submitted", "Shipped"]),
    submitted_date: z.string().nullable(),
    return_date: z.string().nullable().optional(),
    shipped_date: z.string().nullable().optional(),
    customer_name: z.string(),
    customer_id: z.number(),
    submitted_by_name: z.string().nullable(),
    shipped_by_name: z.string().nullable(),
    supplier_name: z.string(),
    contact_name: z.string().nullable(),
});

export const GetInventoryReturnSchema = z.array(InventoryReturnSchema);

export const InventoryReturnItemSchema = z.object({
    inventory_return_item_id: z.number(),
    item_sku: z.string(),
    quantity_to_return: z.number(),
    quantity_shipped: z.number().nullable().optional(),
});

export const GetInventoryReturnItemsSchema = z.array(InventoryReturnItemSchema);

export const ShipInventoryItemSchema = z.object({
    inventory_return_item_id: z.coerce.number(),
    quantity_shipped: z.coerce.number(),
    updated_at: z.union([z.string(), z.date()])
        .transform((val) => {
            const date = typeof val === "string" ? new Date(val) : val;
            return date.toISOString();
    }),
});

export const UpdateInventoryReturnSchema = z.object({
    inventory_return_id: z.coerce.number(),
    performed_by_id: z.coerce.number(),
    customer_id: z.coerce.number(),
});

export type InventoryReturn = z.infer<typeof InventoryReturnSchema>;
export type GetInventoryReturns = z.infer<typeof GetInventoryReturnSchema>;
export type InventoryReturnItem = z.infer<typeof InventoryReturnItemSchema>;
export type GetInventoryReturnItems = z.infer<typeof GetInventoryReturnItemsSchema>;
export type ShipInventoryReturnInput = z.infer<typeof ShipInventoryItemSchema>;
export type UpdateInventoryReturnInput = z.infer<typeof UpdateInventoryReturnSchema>;