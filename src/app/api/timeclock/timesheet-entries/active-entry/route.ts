import { withAuth } from "@/lib/api/with-auth"
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BaseTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const { timesheet_id } = await request.json();

            if (!timesheet_id) return NextResponse.json({ error: "Missing timesheet ID" }, { status: 400 });

            const supabase = await createServerSupabaseClient();

            const { data, error } = await supabase
                .from("hr_timesheet_entries")
                .select(`
                    timesheet_entry_id,
                    time_in,
                    pm_projects (
                        project_number,
                        project_name
                    ),
                    hr_timesheet_tasks (
                        task_name
                    )
                `)
                .eq("timesheet_id", timesheet_id)
                .is("time_out", null)
                .maybeSingle();

            if (error && error.code !== "PGRST116") {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            if (data) {
                const parsed = BaseTimesheetEntrySchema.safeParse(data);
                if (!parsed.success) {
                    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
                }

                return NextResponse.json(parsed.data);
            }

            return NextResponse.json(null);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to fetch active entry" },
                { status: 500 },
            );
        }
    });
}