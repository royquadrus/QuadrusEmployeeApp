"use client";

import { useGetInventoryReturn } from "@/hooks/inventory/inventory-returns/use-get-inventory-return";
import { useGetInventoryReturnItems } from "@/hooks/inventory/inventory-returns/use-get-inventory-return-items";
import { useShipInventoryItem } from "@/hooks/inventory/inventory-returns/use-ship-inventory-item";
import { useUpdateInventoryReturnStatus } from "@/hooks/inventory/inventory-returns/use-update-inventory-return-status";
import { useParams } from "next/navigation";
import { useState } from "react";
import InventoryReturnSkeleton from "../../inventory-return-skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronsUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ShipOrderPage() {
    const params = useParams();
    const returnId = Number(params?.returnId);
    const [isOpen, setIsOpen] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [inputQty, setInputQty] = useState(0);
    const shipInventoryItem = useShipInventoryItem();
    const updateInventoryReturnStatus = useUpdateInventoryReturnStatus();

    const {
        data: invReturn,
        isLoading: invReturnLoading,
        error: invReturnError,
    } = useGetInventoryReturn(returnId);

    const {
        data: items,
        isLoading: itemsLoading,
        error: itemsError,
    } = useGetInventoryReturnItems(returnId);

    if (invReturnLoading || itemsLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(3).map((_, i) => (
                    <InventoryReturnSkeleton key={i} />
                ))]}
            </div>
        );
    }

    if (invReturnError || itemsError) return <div className="p-2">Error loading data</div>;

    const handleShip = (inventory_return_item_id: number, quantity_shipped: number) => {
        shipInventoryItem.mutate({
            inventory_return_id: returnId,
            inventory_return_item_id,
            quantity_shipped,
            updated_at: new Date().toISOString(),
        });
        setEditingItem(null);
    }

    const handleReturnShip = () => {
        updateInventoryReturnStatus.mutate({
            inventory_return_id: invReturn.inventory_return_id,
            status: "Shipped",
            updated_at: new Date().toISOString(),
        });
    }

    return (
        <div className="p-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-semibold">Return Details</h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-1 text-sm">
                    <div className="rounded-md border p-2 grid grid-cols-3 gap-1">
                        <div className="col-span-1 font-semibold">Return #:</div>
                        <div className="col-span-2">{invReturn.return_number}</div>
                        <div className="col-span-1 font-semibold">Customer:</div>
                        <div className="col-span-2">{invReturn.customer_name}</div>
                        <div className="col-span-1 font-semibold">Submitted By:</div>
                        <div className="col-span-2">{invReturn.submitted_by_name}</div>
                        <div className="col-span-1 font-semibold">Submitted On:</div>
                        <div className="col-span-2">{invReturn.submitted_date}</div>
                        <div className="col-span-1 font-semibold">Supplier:</div>
                        <div className="col-span-2">{invReturn.supplier_name}</div>
                        <div className="col-span-1 font-semibold">Supplier Contact:</div>
                        <div className="col-span-2">{invReturn.contact_name}</div>
                        <div className="col-span-1 font-semibold">Return Date:</div>
                        <div className="col-span-2">{invReturn.return_date ?? "-"}</div>
                        <div className="col-span-1 font-semibold">Status:</div>
                        <div className="col-span-2">{invReturn.status}</div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <h2 className="text-lg font-semibold mb-2">Order Items</h2>

            <div className="space-y-2">
                {items.map((item) => {
                    const isComplete = item.quantity_shipped >= item.quantity_to_return;

                    return (
                        <Dialog
                            key={item.inventory_return_item_id}
                            open={editingItem === item.inventory_return_item_id}
                            onOpenChange={(open) => {
                                if (!open) setEditingItem(null);
                            }}
                        >
                            <DialogTrigger asChild disabled={invReturn.status === "Shipped"}>
                                <Card
                                    onClick={() => {
                                        setInputQty(item.quantity_to_return)
                                        setEditingItem(item.inventory_return_item_id);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <div className="text-lg font-semibold">{item.item_sku}</div>
                                            <div className="text-sm text-muted-foreground">Ordered: {item.quantity_to_return}</div>
                                            <div className="text-sm text-muted-foreground">Received: {item.quantity_shipped}</div>
                                        </div>
                                        <CheckCircle className={`w-6 h-6 ${isComplete ? "text-green-500" : "text-muted-foreground"}`} />
                                    </CardContent>
                                </Card>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>Ship Item {item.item_sku}</DialogHeader>
                                {invReturn.status === "Shipped" ? (
                                    <p className="text-sm text-muted-foreground">This order has already been shipped.</p>
                                ) : (
                                    <>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={inputQty}
                                            onChange={(e) => setInputQty(Number(e.target.value))}
                                        />
                                        <DialogFooter>
                                            <Button
                                                onClick={() => handleShip(item.inventory_return_item_id, inputQty)}
                                            >
                                                Ship
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    );
                })}
                <Button
                    onClick={() => handleReturnShip()}
                    disabled={invReturn.status === "Shipped"}
                    className="w-full"
                >
                    Return Shipped
                </Button>
            </div>
        </div>
    );
}