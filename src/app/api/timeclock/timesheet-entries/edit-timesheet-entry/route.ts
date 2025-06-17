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

            const timeIn = new Date(body.time_in);
            const timeOut = new Date(body.time_out);
            const duration = differenceInMinutes(timeOut, timeIn);
            const entryDate = timeIn.toISOString().split("T")[0];

            const updateData = {
                project_id: Number(body.project_id),
                timesheet_task_id: Number(body.timesheet_task_id),
                time_in: timeIn.toISOString(),
                time_out: timeOut.toISOString(),
                duration,
                entry_date: entryDate,
                updated_at: new Date().toISOString(),
            };

            const supabase = await createServerSupabaseClient();

            const { error } = await supabase
                .from("hr_timesheet_entries")
                .update(updateData)
                .eq("timesheet_entry_id", body.timesheet_entry_id)
                .select()
                .single();

            if (error) return NextResponse.json({ error: "Failed to update timesheet entry" }, { status: 500 });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : "Failed to update timesheet entry" },
                { status: 500 }
            );
        }
    });
}