"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { ClockInForm } from "./clock-in-form";
import { ClockedInCard } from "./clocked-in-card";
import { TodaysClockIns } from "./todays-clock-ins";
import { useTodaysHours } from "@/hooks/timeclock/timesheet-entries/use-todays-hours";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { formatDuration } from "@/lib/utils/time-utils";

export default function TimeClockPage() {
    const { activeEntry } = useTimeclockSessionStore();
    const { employee } = useAuthStore();
    const { data: todaysHours } = useTodaysHours(employee.employee_id);

    console.log("PAGE:", todaysHours);

    return (
        <div className="container py-5 space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center font-bold">Total Hours Worked Today</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-xl font-bold text-muted-foreground">
                    {formatDuration(todaysHours)}
                </CardContent>
            </Card>
            {activeEntry ? (
                <>
                    <ClockedInCard />
                    <TodaysClockIns />
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Clock In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClockInForm />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}