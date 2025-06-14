import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { orderId } = await request.json();
            const inventory_order_id = Number(orderId);

            if (isNaN(inventory_order_id)) {
                return NextResponse.json({ error: "Invalid inventory order id" }, { status: 400 });
            }
            
            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("inv_inventory_order_items")
                .select(`
                    inventory_order_item_id,
                    item_sku,
                    quantity_ordered,
                    quantity_received
                `)
                .eq("inventory_order_id", inventory_order_id);

            if (error) throw error;
            return NextResponse.json(data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch inventory order" },
                { status: 500 }
            );
        }
    });
}