import { DashboardInventoryReturn } from "@/lib/validation/inventory-dashboard";
import { ColumnDef } from "@tanstack/react-table";

export function getDashboardInventoryReturnColumns(): ColumnDef<DashboardInventoryReturn>[] {
    return [
        {
            accessorKey: "return_number",
            header: "Ret #",
            cell: ({ row }) => row.original.return_number,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => row.original.supplier,
        },
    ];
}