import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DashboardMonthlyUsageSchema } from "@/lib/validation/inventory-dashboard";
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
                .rpc("get_monthly_inventory_usage_stats");

            if (error) throw error;

            const parsed = z.array(DashboardMonthlyUsageSchema).safeParse(data);

            if (!parsed.success) {
                return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
            }

            return NextResponse.json(parsed.data[0]);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch monthly usage" },
                { status: 500 },
            );
        }
    });
}