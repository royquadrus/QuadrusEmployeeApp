import { DashboardInventoryReturn } from "@/lib/validation/inventory-dashboard";
import { getDashboardInventoryReturnColumns } from "./dash-inv-returns-columns";
import { DataTable } from "@/components/ui/data-table";

interface DashboardInventoryReturnTableProps {
    data: DashboardInventoryReturn[];
}

export function DashboardInventoryReturnTable({ data }: DashboardInventoryReturnTableProps) {
    const columns = getDashboardInventoryReturnColumns();

    return (
        <DataTable
            columns={columns}
            data={data}
        />
    )
}