import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { returnId } = await request.json();
            const inventory_return_id = Number(returnId);

            if (isNaN(inventory_return_id)) {
                return NextResponse.json({ error: "Invalid inventory return id" }, { status: 400 });
            }
            
            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("inv_inventory_return_items")
                .select(`
                    inventory_return_item_id,
                    item_sku,
                    quantity_to_return,
                    quantity_shipped
                `)
                .eq("inventory_return_id", inventory_return_id);

            if (error) throw error;
            return NextResponse.json(data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch inventory return items" },
                { status: 500 }
            );
        }
    });
}