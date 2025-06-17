import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UpdateInventoryReturnSchema } from "@/lib/validation/inventory-return";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = UpdateInventoryReturnSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: "invalid input type" }, { status: 400 });
            }

            const supabase = await createServerSupabaseClient();

            const { error } = await supabase
                .rpc("mark_inventory_return_shipped", {
                    target_inventory_return_id: parsed.data.inventory_return_id,
                    target_customer_id: parsed.data.customer_id,
                    performed_by_id: parsed.data.performed_by_id,
                });

            if (error) {
                console.log(error);
                return NextResponse.json({ error: "Failed to update inventory return status" }, { status: 400 });
            }

            return NextResponse.json({ inventory_return_id: parsed.data.inventory_return_id });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to update inventory return status" },
                { status: 500 }
            );
        }
    });
}