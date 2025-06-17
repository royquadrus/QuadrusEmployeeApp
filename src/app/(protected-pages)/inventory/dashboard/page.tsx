"use client";

import { DashboardInventoryOrderTable } from "./dash-inv-order-table";
import { DashboardInventoryReturnTable } from "./dash-inv-return-table";
import { useGetInventoryDashboardOrders } from "@/hooks/inventory/inventory-dashboard/use-get-inventory-dashboard-orders";
import { useGetInventoryDashboardReturns } from "@/hooks/inventory/inventory-dashboard/use-get-inventory-dashboard-returns";

export default function InventoryDashboardPage() {
    const { data: inventoryOrderData, isLoading, error } = useGetInventoryDashboardOrders();
    const { data: inventoryReturnData, isLoading: returnIsLoading, error: returnError } = useGetInventoryDashboardReturns()

    if (isLoading || returnIsLoading) return <div>Loading...</div>;
    if (error || returnError) return <div>Error loading orders...</div>;

    return (
        <div>
            <div className="mb-2">
                <h1 className="text-lg font-semibold">Today&apos;s Deliveries</h1>
                <DashboardInventoryOrderTable data={inventoryOrderData ?? []} />
            </div>
            <div className="mb-2">
                <h1 className="text-lg font-semibold">Today&apos;s Returns</h1>
                <DashboardInventoryReturnTable data={inventoryReturnData ?? []} />
            </div>
        </div>
    );
}