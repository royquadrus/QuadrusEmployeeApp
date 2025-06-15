"use client";

import { useGetInventoryRemaining } from "@/hooks/inventory/inventory-remaining/use-get-inventory-remaining";
import InventoryRemainingSkeleton from "./inventory-remaining-skeletong";
import { useCreateInventoryRemaining } from "@/hooks/inventory/inventory-remaining/use-create-inventory-remaining";
import { InventoryRemainingForm } from "./inventory-remaining-form";
import { CreateInventoryRemainingSchema } from "@/lib/validation/inventory-remaining";

export default function InventoryRemainingPage() {
    const { data: inventoryRemaining, isLoading, error } = useGetInventoryRemaining();
    const { mutate: createInventoryRemaining, isPending } = useCreateInventoryRemaining();

    if (isLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(10)].map((_, i) => (
                    <InventoryRemainingSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) return <div className="p-2">Error loading inventory remaining</div>;

    return (
        <div className="p-4">
            <InventoryRemainingForm
                submitLabel="Submit"
                onSubmit={(data) => createInventoryRemaining(data)}
                schema={CreateInventoryRemainingSchema}
                isPending={isPending}
            />
            <h2 className="text-lg font-bold p-2">Last 10 Items Counted</h2>
            <div className="space-y-2">
                {inventoryRemaining.map((item, index) => (
                    <div key={index} className="p-2 flex flex-col rounded-md border">
                        <div className="font-semibold">{item.item_sku}</div>
                        <div className="text-muted-foreground">
                            <strong>WO #:</strong> {item.work_order_number}
                        </div>
                        <div className="text-muted-foreground">
                            <strong>Qty:</strong> {item.quantity}
                        </div>
                        <div className="text-muted-foregr">
                            <strong>Counted By:</strong> {item.counted_by_name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}