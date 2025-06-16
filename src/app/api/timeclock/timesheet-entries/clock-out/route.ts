import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { differenceInMinutes } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            
            const now = new Date();
            const timeOut = now.toISOString();
            const timeIn = new Date(body.time_in);

            const durationMinutes = differenceInMinutes(now, timeIn);

            const entryData = {
                time_out: timeOut,
                duration: durationMinutes,
                updated_at: timeOut,
            };

            const supabase = await createServerSupabaseClient();

            const { error } = await supabase
                .from("hr_timesheet_entries")
                .update(entryData)
                .eq("timesheet_entry_id", body.timesheet_entry_id);
            
            if (error) return NextResponse.json({ error: "Failed to clock out" }, { status: 500 });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to clock out' },
                { status: 500 }
            )
        }
    });    
}