import { DashboardInventoryOrder } from "@/lib/validation/inventory-dashboard";
import { getDashboardInventoryOrderColumns } from "./dash-inv-orders-columns";
import { DataTable } from "@/components/ui/data-table";

interface DashboardInventoryOrderTableProps {
    data: DashboardInventoryOrder[];
}

export function DashboardInventoryOrderTable({ data }: DashboardInventoryOrderTableProps) {
    const columns = getDashboardInventoryOrderColumns();

    return (
        <DataTable
            columns={columns}
            data={data}
        />
    );
}