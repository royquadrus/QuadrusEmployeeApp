import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized "}, { status: 401 });
        }

        try {
            const body = await request.json();
            console.log("API body:", body);

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .rpc("get_todays_total_hours", {
                    target_employee_id: body.employeeId,
                });

            console.log("API Error:", error);

            if (error) return NextResponse.json({ error: "Failed to get todays hours" }, { status: 400 });
            console.log("API Data:", data);

            return NextResponse.json(data);
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get todays hours" },
                { status: 500 },
            );
        }
    });
}