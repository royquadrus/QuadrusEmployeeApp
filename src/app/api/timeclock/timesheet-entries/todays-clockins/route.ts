import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FullTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const url = new URL(request.url);
            const timesheetId = Number(url.searchParams.get("timesheetId"));

            if (!timesheetId) {
                return NextResponse.json({ error: "Timesheet ID is required" }, { status: 400 });
            }
            const today = new Date().toISOString().split('T')[0];

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("hr_timesheet_entries")
                .select(`
                    timesheet_entry_id,
                    time_in,
                    time_out,
                    duration,
                    entry_date,
                    pm_projects (
                        project_number,
                        project_name
                    ),
                    hr_timesheet_tasks (
                        task_name
                    )
                `)
                .eq("timesheet_id", timesheetId)
                .eq("entry_date", today)
                .order("time_in", { ascending: false });

            console.log("API:", data);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            if (data) {
                const parsed = FullTimesheetEntrySchema.array().safeParse(data);
                console.log("API Parsed?:", parsed);
                if (!parsed.success) {
                    return NextResponse.json({ error: parsed.error.format() }, { status: 500 });
                }

                return NextResponse.json(parsed.data);
            }

            return NextResponse.json([]);
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to get today's timesheet entries" },
                { status: 500 }
            );
        }
    });
}