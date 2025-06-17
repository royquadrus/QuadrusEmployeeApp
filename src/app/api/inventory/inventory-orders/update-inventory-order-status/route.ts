import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UpdateInventoryOrderSchema } from "@/lib/validation/inventory-order";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = UpdateInventoryOrderSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: "invalid input type" }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { error } = await supabase
                .rpc("mark_inventory_order_received", {
                    target_inventory_order_id: parsed.data.inventory_order_id,
                    performed_by_id: parsed.data.performed_by_id,
                });

            console.log(error);
            if (error) {
                return NextResponse.json({ error: "Failed to update inventory order status" }, { status: 400 });
            }

            return NextResponse.json({ inventory_order_id: parsed.data.inventory_order_id });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to update inventory order status" },
                { status: 500 }
            );
        }
    });
}