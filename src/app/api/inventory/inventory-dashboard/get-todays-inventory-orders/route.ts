import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardInventoryOrderSchema } from "@/lib/validation/inventory-dashboard";
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
                .from("inv_inventory_orders")
                .select(`
                    inventory_order_id,
                    order_number,
                    crm_suppliers (
                        supplier_name
                    )
                `)
                .eq("delivery_date", new Date().toISOString().split("T")[0]);

            if (error) throw error;

            const parsed = z.array(DashboardInventoryOrderSchema).safeParse(data);

            if (!parsed.success) {
                return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
            }

            return NextResponse.json(parsed.data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch todays inventory orders" },
                { status: 500 },
            );
        }
    });
}