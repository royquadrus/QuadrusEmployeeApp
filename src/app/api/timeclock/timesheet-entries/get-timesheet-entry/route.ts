import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { searchParams } = new URL(request.url);
            const timesheetEntryId = searchParams.get("timesheetEntryId");

            if (!timesheetEntryId) return NextResponse.json({ error: "Timesheet entry id is required" }, { status: 500 });

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("hr_timesheet_entries")
                .select("timesheet_entry_id, project_id, timesheet_task_id, time_in, time_out")
                .eq("timesheet_entry_id", Number(timesheetEntryId))
                .single();

            if (error) throw error;
            
            return NextResponse.json(data);
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch timesheet entry" },
                { status: 500 },
            );
        }
    });
}