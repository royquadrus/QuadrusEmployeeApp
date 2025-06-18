import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InventoryRemainingSchema } from "@/lib/validation/inventory-remaining";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("inv_inventory_remaining")
                .select(`
                    item_sku,
                    quantity,
                    pm_work_orders (
                        work_order_number
                    ),
                    hr_employees (
                        first_name,
                        last_name
                    )
                `)
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) throw error;

            const parsed = z.array(InventoryRemainingSchema).safeParse(data);

            if (!parsed.success) {
                return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
            }

            return NextResponse.json(parsed.data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch inventory used" },
                { status: 500 },
            );
        }
    });
}