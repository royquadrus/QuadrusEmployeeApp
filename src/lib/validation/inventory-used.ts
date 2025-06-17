import { z } from "zod";

export const CreateInventoryUsedSchema = z.object({
    work_order_id: z.coerce.number(),
    item_sku: z.string(),
    quantity: z.coerce.number(),
    loaded_by_id: z.number(),
});

export const InventoryUsedSchema = z.object({
    item_sku: z.string(),
    quantity: z.number(),
    pm_work_orders: z.object({
        work_order_number: z.string(),
    }),
    hr_employees: z.object({
        first_name: z.string(),
        last_name: z.string(),
    }),
}).transform((data) => ({
    item_sku: data.item_sku,
    quantity: data.quantity,
    work_order_number: data.pm_work_orders.work_order_number,
    loaded_by_name: `${data.hr_employees.first_name} ${data.hr_employees.last_name}`,
}));

export type CreateInventoryUsedInput = z.infer<typeof CreateInventoryUsedSchema>;
export type InventoryUsed = z.infer<typeof InventoryUsedSchema>;