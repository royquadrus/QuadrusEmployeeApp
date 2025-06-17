"use client";

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardInventoryOrderTable } from "./dash-inv-order-table";
import { DashboardInventoryReturnTable } from "./dash-inv-return-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export default function InventoryDashboardPage() {
    const inventoryData = [
        {
            inventory_order_id: 1,
            order_number: "2025-001-01",
            supplier: "Copps Buildall",
        },
    ];
    const returnData = [
        {
            inventory_return_id: 2,
            return_number: "2025-008-01",
            supplier: "Langford Lumber",
        },
    ];

    return (
        <div>
            <div className="mb-2">
                <h1 className="text-lg font-semibold">Today&apos;s Deliveries</h1>
                <DashboardInventoryOrderTable data={inventoryData ?? []} />
            </div>
            <div className="mb-2">
                <h1 className="text-lg font-semibold">Today&apos;s Returns</h1>
                <DashboardInventoryReturnTable data={returnData ?? []} />
            </div>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Board Feet of Inventory</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        14,553.554
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +15.75%
                        </Badge>
                    </CardAction>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Board feet used this month 45,222
                        </div>
                    </CardFooter>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total SqFt of Sheet Goods</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                        1,250
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendingUp />
                            +25.75%
                        </Badge>
                    </CardAction>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Square feet used this month 10,222
                        </div>
                    </CardFooter>
                </CardHeader>
            </Card>
        </div>
    );
}