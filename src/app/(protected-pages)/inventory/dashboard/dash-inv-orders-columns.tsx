import { DashboardInventoryOrder } from "@/lib/validation/inventory-dashboard";
import { ColumnDef } from "@tanstack/react-table";

export function getDashboardInventoryOrderColumns(): ColumnDef<DashboardInventoryOrder>[] {
    return [
        {
            accessorKey: "order_number",
            header: "Order Number",
            cell: ({ row }) => row.original.order_number,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => row.original.supplier,
        },
    ];
}