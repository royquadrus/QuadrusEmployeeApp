"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, Path, useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

type InventoryRemainingFormProps<TSchema extends ZodTypeAny> = {
    onSubmit: (data: z.infer<TSchema>) => void;
    isPending?: boolean;
    submitLabel?: string;
    schema: TSchema;
    onSuccess?: () => void;
};

export function InventoryRemainingForm<TSchema extends ZodTypeAny>({
    onSubmit,
    isPending,
    submitLabel = "Submit",
    schema,
    onSuccess,
}: InventoryRemainingFormProps<TSchema>) {
    type SchemaType = z.infer<TSchema>;

    const workOrders = useDropdownStore((s) => s.workOrders);
    const inventoryItems = useDropdownStore((s) => s.inventoryItems);
    const { employee } = useAuthStore();

    const form = useForm<z.infer<TSchema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            work_order_id: "",
            item_sku: "",
            quantity: "",
            counted_by_id: employee.employee_id,
        } as DefaultValues<SchemaType>,
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(async (data) => {
                    try {
                        onSubmit(data);
                        form.reset();
                        onSuccess?.();
                    } catch (e) {
                        console.error("Error:", e);
                    }
                })}
                className="flex flex-col"
            >
                <FormField
                    control={form.control}
                    name={"work_order_id" as Path<SchemaType>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Work Order</FormLabel>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value.toString() ?? ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select work order" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {workOrders.map((w) => (
                                        <SelectItem key={w.id} value={w.id}>
                                            {w.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"item_sku" as Path<SchemaType>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select inventory item" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {inventoryItems.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"quantity" as Path<SchemaType>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input type="number" min={0} placeholder="Quantity" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="col-span-full flex-justify-end gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Submitting..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}