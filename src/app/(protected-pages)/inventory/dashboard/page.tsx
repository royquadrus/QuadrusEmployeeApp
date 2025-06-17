"use client";

import { useGetInventoryDashboardStats } from "@/hooks/inventory/inventory-dashboard/use-get-inventory-dashboard-stats";
import { DashboardInventoryOrderTable } from "./dash-inv-order-table";
import { DashboardInventoryReturnTable } from "./dash-inv-return-table";
import { useGetInventoryDashboardOrders } from "@/hooks/inventory/inventory-dashboard/use-get-inventory-dashboard-orders";
import { useGetInventoryDashboardReturns } from "@/hooks/inventory/inventory-dashboard/use-get-inventory-dashboard-returns";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMonthlyInventoryUsage } from "@/hooks/inventory/inventory-dashboard/use-get-monthly-inventory-usage";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function InventoryDashboardPage() {
    const { data: inventoryOrderData, isLoading, error } = useGetInventoryDashboardOrders();
    const { data: inventoryReturnData, isLoading: returnIsLoading, error: returnError } = useGetInventoryDashboardReturns()
    const { data: statsData, isLoading: statsIsLoading, error: statsError } = useGetInventoryDashboardStats();
    const { data: monthlyUsage, isLoading: monthlyIsLoading, error: monthlyError } = useGetMonthlyInventoryUsage();
    console.log("PAGE:", monthlyUsage);

    if (isLoading || returnIsLoading || statsIsLoading || monthlyIsLoading) return <div>Loading...</div>;
    if (error || returnError || statsError || monthlyError) return <div>Error loading orders...</div>;

    const mtd = Number(monthlyUsage.mtd_board_feet_used ?? 0);
    const pmtd = Number(monthlyUsage.pmtd_board_feet_used ?? 0);

    const trendUp = mtd >= pmtd;
    const trendPercent = pmtd === 0 ? null : Math.abs(((mtd - pmtd) / pmtd) * 100);

    const smtd = Number(monthlyUsage.mtd_sheet_goods_sqft_used ?? 0);
    const spmtd = Number(monthlyUsage.pmtd_sheet_goods_sqft_used ?? 0);

    const strendUp = smtd >= spmtd;
    const strendPercent = spmtd === 0 ? null : Math.abs(((smtd - spmtd) / spmtd) * 100);

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
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Board Feet of Inventory</CardDescription>
                    <CardTitle className="text-xl font-semibold">
                        {statsData.total_board_feet}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        MTD is trending <span className={trendUp ? "text-green-600" : "text-red-600"}>
                            {trendUp ? "Up" : "Down"}{" "}
                            {trendUp ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                        </span>
                        {trendPercent !== null && (
                            <span className="ml-1 text-muted-foreground">
                                ({trendPercent.toFixed(1)}%)
                            </span>
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        <p><strong>Board feet used this MTD:</strong> {monthlyUsage.mtd_board_feet_used ? monthlyUsage.mtd_board_feet_used : "0"}</p>
                        <p><strong>Board feet used last MTD:</strong> {monthlyUsage.pmtd_board_feet_used ? monthlyUsage.pmtd_board_feet_used : "0"}</p>
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total SqFt of Sheet goods</CardDescription>
                    <CardTitle className="text-xl font-semibold">
                        {statsData.total_square_footage}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        MTD is trending <span className={strendUp ? "text-green-600" : "text-red-600"}>
                            {strendUp ? "Up" : "Down"}{" "}
                            {strendUp ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                        </span>
                        {strendPercent !== null && (
                            <span className="ml-1 text-muted-foreground">
                                ({strendPercent.toFixed(1)}%)
                            </span>
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        <p><strong>SqFt used this MTD:</strong> {monthlyUsage.mtd_sheet_goods_sqft_used ? monthlyUsage.mtd_sheet_goods_sqft_used : "0"}</p>
                        <p><strong>SqFt used last MTD:</strong> {monthlyUsage.pmtd_sheet_goods_sqft_used ? monthlyUsage.pmtd_sheet_goods_sqft_used : "0"}</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
        
    );
}