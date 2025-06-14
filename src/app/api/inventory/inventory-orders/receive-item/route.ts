import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ReceiveInventoryItemSchema } from "@/lib/validation/inventory-order";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = ReceiveInventoryItemSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: "Invalid input type" }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("inv_inventory_order_items")
                .update(parsed.data)
                .eq("inventory_order_item_id", parsed.data.inventory_order_item_id)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: "Failed to update inventory order item" }, { status: 400 });
            }

            return NextResponse.json(data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message: "Failed to update inventory order item" },
                { status: 500 }
            );
        }
    });
}