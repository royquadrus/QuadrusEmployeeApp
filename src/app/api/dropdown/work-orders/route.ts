import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("pm_work_orders")
                //.select("work_order_id, work_order_number")
                .select(`
                    work_order_id,
                    work_order_number,
                    pm_projects (
                        project_name
                    )
                `)
                .filter("work_order_status", "not.in", "(Quoting,Built,Shipped,Completed)");

            if (error) throw error;

            return NextResponse.json(data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch work orders" },
                { status: 500 },
            );
        }
    });
}