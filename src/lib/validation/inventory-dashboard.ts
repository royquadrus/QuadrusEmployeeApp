import { z } from "zod";

export const DashboardInventoryReturnSchema = z.object({
    inventory_return_id: z.coerce.string(),
    return_number: z.string(),
    crm_suppliers: z.object({
        supplier_name: z.string(),
    }),
}).transform((data) => ({
    inventory_return_id: data.inventory_return_id,
    return_number: data.return_number,
    supplier_name: data.crm_suppliers.supplier_name,
}));

export const DashboardInventoryOrderSchema = z.object({
    inventory_order_id: z.coerce.string(),
    order_number: z.string(),
    crm_suppliers: z.object({
        supplier_name: z.string(),
    }),
}).transform((data) => ({
    inventory_order_id: data.inventory_order_id,
    order_number: data.order_number,
    supplier_name: data.crm_suppliers.supplier_name,
}));

export const DashboardInventoryStatsSchema = z.object({
    total_board_feet: z.number().nullable(),
    total_square_footage: z.number().nullable(),
});

export const DashboardMonthlyUsageSchema = z.object({
    mtd_board_feet_used: z.number().nullable(),
    mtd_sheet_goods_sqft_used: z.number().nullable(),
    pmtd_board_feet_used: z.number().nullable(),
    pmtd_sheet_goods_sqft_used: z.number().nullable(),
});

export type DashboardInventoryOrder = z.infer<typeof DashboardInventoryOrderSchema>;
export type DashboardInventoryReturn = z.infer<typeof DashboardInventoryReturnSchema>;
export type DashboardInventoryStats = z.infer<typeof DashboardInventoryStatsSchema>;
export type DashboardMonthlyUsage = z.infer<typeof DashboardMonthlyUsageSchema>;