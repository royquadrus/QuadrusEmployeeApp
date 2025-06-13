import { z } from "zod";

export const InventoryOrderSchema = z.object({
    inventory_order_id: z.number(),
    order_number: z.string(),
    order_status: z.enum(["Ordered", "Received"]),
    order_date: z.string().nullable(),
    delivery_date: z.string().nullable().optional(),
    received_date: z.string().nullable().optional(),
    work_order_number: z.string(),
    work_order_id: z.number(),
    ordered_by_name: z.string().nullable(),
    received_by_name: z.string().nullable(),
    supplier_name: z.string(),
    contact_name: z.string().nullable(),
});

export const InventoryOrderItemSchema = z.object({
    inventory_order_item_id: z.number(),
    item_sku: z.string(),
    quantity_ordered: z.number(),
    quantity_received: z.number().nullable().optional(),
});

export const ReceiveInventoryItemSchema = z.object({
    inventory_order_item_id: z.coerce.number(),
    quantity_received: z.coerce.number(),
    updated_at: z.coerce.date().transform((date) => date instanceof Date ? date.toISOString() : date),
});

export const UpdateInventoryOrderSchema = z.object({
    inventory_order_id: z.coerce.number(),
    order_status: z.enum(["Ordered", "Received"]),
    updated_at: z.coerce.date().transform((date) => date instanceof Date ? date.toISOString() : date),
});

export const GetInventoryOrdersSchema = z.array(InventoryOrderSchema);
export const GetInventoryOrderItemsSchema = z.array(InventoryOrderItemSchema);

export type InventoryOrder = z.infer<typeof InventoryOrderSchema>;
export type GetInventoryOrders = z.infer<typeof GetInventoryOrdersSchema>;
export type InventoryOrderItem = z.infer<typeof InventoryOrderItemSchema>;
export type GetInventoryOrderItems = z.infer<typeof GetInventoryOrderItemsSchema>;
export type ReceiveInventoryInput = z.infer<typeof ReceiveInventoryItemSchema>;
export type UpdateInventoryOrderInput = z.infer<typeof UpdateInventoryOrderSchema>;