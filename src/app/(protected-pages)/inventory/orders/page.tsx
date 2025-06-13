"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetInventoryOrders } from "@/hooks/inventory/inventory-orders/use-get-inventory-orders";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InventoryOrderSkeleton from "./inventory-order-skeleton";

export default function InventoryOrdersPage() {
    const [showAll, setShowAll] = useState(false);
    const { data: inventoryOrders, isLoading, error } = useGetInventoryOrders();
    const router = useRouter();

    console.log("Page:", inventoryOrders);

    if (isLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <InventoryOrderSkeleton key={i} />
                ))}
            </div>
        );
    }
    
    if (error) return <div className="p-2">Error loading inventory orders</div>;  

    const filteredOrders = showAll
        ? inventoryOrders
        : inventoryOrders.filter((order) => order.order_status === "Ordered");

    const handleDivClick = (orderId: number) => {
        router.push(`/inventory/orders/${orderId}/receive`);
    }

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4">
                <Label htmlFor="showAll">Show all Orders</Label>
                <Switch 
                    id="showAll"
                    checked={showAll}
                    onCheckedChange={setShowAll}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{showAll ? "All Inventory Orders" : "Unreceived Orders"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredOrders.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No orders found.</div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.inventory_order_id}
                                className="rounded-lg border p-3 hover:shadow-sm hover:bg-accent/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onClick={() => handleDivClick(order.inventory_order_id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleDivClick(order.inventory_order_id);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                            >
                                <div className="text-base font-bold">{order.order_number}</div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>Work Order:</strong> {order.work_order_number}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>Supplier:</strong> {order.supplier_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>Status:</strong> {order.order_status}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}