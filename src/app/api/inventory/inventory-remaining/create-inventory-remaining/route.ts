import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateInventoryRemainingSchema } from "@/lib/validation/inventory-remaining";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = CreateInventoryRemainingSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: "invalid input type" }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { error } = await supabase
                .rpc("process_inventory_remaining", {
                    target_work_order_id: parsed.data.work_order_id,
                    target_item_sku: parsed.data.item_sku,
                    target_performed_by_id: parsed.data.counted_by_id,
                    target_quantity: parsed.data.quantity,
                });

            console.log(error);
            if (error) {
                return NextResponse.json({ error: "Failed to create inventory used" }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to create inventory used" },
                { status: 500 }
            );
        }
    });
}