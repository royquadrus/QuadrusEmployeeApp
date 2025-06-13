"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetInventoryOrder } from "@/hooks/inventory/inventory-orders/use-get-inventory-order";
import { CheckCircle, ChevronsUpDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import InventoryOrderSkeleton from "../../inventory-order-skeleton";
import { useGetInventoryOrderItems } from "@/hooks/inventory/inventory-orders/use-get-inventory-order-items";
import { useReceiveInventoryItem } from "@/hooks/inventory/inventory-orders/use-receive-inventory-item";
import { ReceiveInventoryInput } from "@/lib/validation/inventory-order";
import { useUpdateInventoryOrderStatus } from "@/hooks/inventory/inventory-orders/use-update-inventory-order-status";

export default function ReceiveOrderPage() {
    const params = useParams();
    const orderId = Number(params?.orderId);
    const [isOpen, setIsOpen] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [inputQty, setInputQty] = useState(0);
    const receiveInventoryItem = useReceiveInventoryItem();
    const updateInventoryOrderStatus = useUpdateInventoryOrderStatus();

    const {
        data: order,
        isLoading: orderLoading,
        error: orderError
    } = useGetInventoryOrder(orderId);

    const {
        data: items,
        isLoading: itemsLoading,
        error: itemsError,
    } = useGetInventoryOrderItems(orderId);

    if (orderLoading || itemsLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(3).map((_, i) => (
                    <InventoryOrderSkeleton key={i} />
                ))]}
            </div>
        );
    }

    if (orderError || itemsError) return <div className="p-2">Error loading data</div>;

    const handleReceive = (inventory_order_item_id: number, quantity_received: number) => {
        receiveInventoryItem.mutate({
            inventory_order_id: orderId,
            inventory_order_item_id,
            quantity_received,
            updated_at: new Date().toISOString(),
        });
        setEditingItem(null);
    };

    const handleOrderReceive = () => {
        updateInventoryOrderStatus.mutate({
            inventory_order_id: order.inventory_order_id,
            order_status: "Received",
            updated_at: new Date().toISOString(),
        });
    }

    return (
        <div className="p-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-semibold">Order Details</h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-1 text-sm">
                    <div className="rounded-md border p-2 grid grid-cols-3 gap-1">
                        <div className="col-span-1 font-semibold">Order #:</div>
                        <div className="col-span-2">{order.order_number}</div>
                        <div className="col-span-1 font-semibold">Work Order:</div>
                        <div className="col-span-2">{order.work_order_number}</div>
                        <div className="col-span-1 font-semibold">Ordered By:</div>
                        <div className="col-span-2">{order.ordered_by_name}</div>
                        <div className="col-span-1 font-semibold">Ordered On:</div>
                        <div className="col-span-2">{order.order_date}</div>
                        <div className="col-span-1 font-semibold">Supplier:</div>
                        <div className="col-span-2">{order.supplier_name}</div>
                        <div className="col-span-1 font-semibold">Supplier Contact:</div>
                        <div className="col-span-2">{order.contact_name}</div>
                        <div className="col-span-1 font-semibold">Delivery Date:</div>
                        <div className="col-span-2">{order.delivery_date ?? "-"}</div>
                        <div className="col-span-1 font-semibold">Status:</div>
                        <div className="col-span-2">{order.order_status}</div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <h2 className="text-lg font-semibold mb-2">Order Items</h2>

            <div className="space-y-2">
                {items.map((item) => {
                    const isComplete = item.quantity_received >= item.quantity_ordered;

                    return (
                        <Dialog
                            key={item.inventory_order_item_id}
                            open={editingItem === item.inventory_order_item_id}
                            onOpenChange={(open) => {
                                if (!open) setEditingItem(null);
                            }}
                        >
                            <DialogTrigger asChild disabled={order.order_status === "Received"}>
                                <Card
                                    onClick={() => {
                                        setInputQty(item.quantity_ordered)
                                        setEditingItem(item.inventory_order_item_id);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <div className="text-lg font-semibold">{item.item_sku}</div>
                                            <div className="text-sm text-muted-foreground">Ordered: {item.quantity_ordered}</div>
                                            <div className="text-sm text-muted-foreground">Received: {item.quantity_received}</div>
                                        </div>
                                        <CheckCircle className={`w-6 h-6 ${isComplete ? "text-green-500" : "text-muted-foreground"}`} />
                                    </CardContent>
                                </Card>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>Receive Item</DialogHeader>
                                {order.order_status === "Received" ? (
                                    <p className="text-sm text-muted-foreground">This order has already been received.</p>
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
                                                onClick={() => handleReceive(item.inventory_order_item_id, inputQty)}
                                            >
                                                Receive
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    );
                })}
                <Button
                    onClick={() => handleOrderReceive()}
                    disabled={order.order_status === "Received"}
                    className="w-full"
                >
                    Order Received
                </Button>
            </div>
        </div>
    );
}