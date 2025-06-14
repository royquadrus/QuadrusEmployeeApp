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
                .from("view_employee_inventory_order_summary")
                .select()
                .eq("inventory_order_id", inventory_order_id)
                .single();

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