import { withAuth } from "@/lib/api/with-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FullClockInSchema } from "@/lib/validation/timeclock";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    return withAuth(request, async (user) => {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            
            // validate the basic clock-in data
            const validatedData = FullClockInSchema.parse(body);

            const supabase = await createServerSupabaseClient();

            const entryDate = new Date(validatedData.time_in).toISOString().split("T")[0];

            const entryData = {
                ...validatedData,
                entry_date: entryDate,
            };

            const { data, error } = await supabase
                .from("hr_timesheet_entries")
                .insert(entryData)
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json(data);
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Failed to clock in' },
                { status: 500 }
            );
        }
    });
}