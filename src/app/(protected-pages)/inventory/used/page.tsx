"use client";

import { useCreateInventoryUsed } from "@/hooks/inventory/inventory-used/use-create-inventory-used";
import { InventoryUsedForm } from "./inventory-used-form";
import { CreateInventoryUsedSchema } from "@/lib/validation/inventory-used";
import { useGetInventoryUsed } from "@/hooks/inventory/inventory-used/use-get-inventory-used";
import InventoryUsedSkeleton from "./inventory-used-skeleton";

export default function InventoryUsedPage() {
    const { data: inventoryUsed, isLoading, error } = useGetInventoryUsed();
    const { mutate: createInventoryUsed, isPending } = useCreateInventoryUsed();

    if (isLoading) {
        return (
            <div className="p-2 space-y-3">
                {[...Array(10)].map((_, i) => (
                    <InventoryUsedSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) return <div className="p-2">Error loading inventory used</div>;

    return (
        <div className="p-4">
            <InventoryUsedForm
                submitLabel="Submit"
                onSubmit={(data) => createInventoryUsed(data)}
                schema={CreateInventoryUsedSchema}
                isPending={isPending}
            />
            <h2 className="text-lg font-bold p-2">Last 10 Items Loaded</h2>
            <div className="space-y-2">
                {inventoryUsed.map((item, index) => (
                    <div key={index} className="p-2 flex flex-col rounded-md border">
                        <div className="font-semibold">{item.item_sku}</div>
                        <div className="text-muted-foreground">
                            <strong>WO #:</strong> {item.work_order_number}
                        </div>
                        <div className="text-muted-foreground">
                            <strong>Qty:</strong> {item.quantity}
                        </div>
                        <div className="text-muted-foreground">
                            <strong>Loaded By:</strong> {item.loaded_by_name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}