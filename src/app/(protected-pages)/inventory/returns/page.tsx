"use client";

import { useGetInventoryReturns } from "@/hooks/inventory/inventory-returns/use-get-inventory-returns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InventoryReturnSkeleton from "./inventory-return-skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryReturnsPage() {
    const [showAll, setShowAll] = useState(false);
    const { data: inventoryReturns, isLoading, error } = useGetInventoryReturns();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <InventoryReturnSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) <div className="p-2">Error loading inventory returns</div>;

    const filteredReturns = showAll
        ? inventoryReturns
        : inventoryReturns.filter((invReturn) => invReturn.status === "Submitted");

    const handleDivClick = (returnId: number) => {
        router.push(`/inventory/returns/${returnId}/ship`);
    }

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4">
                <Label htmlFor="showAll">Show All Returns</Label>
                <Switch
                    id="showAll"
                    checked={showAll}
                    onCheckedChange={setShowAll}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{showAll ? "All Inventory Returns" : "Unshipped Orders"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredReturns.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No returns found.</div>
                    ) : (
                        filteredReturns.map((invReturn) => (
                            <div
                                key={invReturn.inventory_return_id}
                                className="rounded-lg border p-3 hover:shadow-sm hover:bg-accent/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                                onClick={() => handleDivClick(invReturn.inventory_return_id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleDivClick(invReturn.inventory_return_id);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                            >
                                <div className="text-base font-bold">{invReturn.return_number}</div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>Customer:</strong> {invReturn.customer_name}
                                </div>
                                <div className="text-sm text-muted_foreground">
                                    <strong>Supplier:</strong> {invReturn.supplier_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>Status:</strong> {invReturn.status}
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}