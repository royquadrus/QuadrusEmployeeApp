"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodaysTimesheetEntries } from "@/hooks/timeclock/timesheet-entries/use-todays-timesheet-entries";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { format } from "date-fns";

export function TodaysClockIns() {
    const { currentTimesheet } = useTimeclockSessionStore();
    const { data: todaysClockIns, isLoading } = useTodaysTimesheetEntries(currentTimesheet.timesheet_id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today&apos;s Clock Ins</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            Loading clock-ins...
                        </div>
                    </div>
                ) : todaysClockIns.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                        <p className="text-muted-foreground">No clock-ins recorded today</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todaysClockIns.map((clockIn) => (
                            <div
                                key={clockIn.timesheet_entry_id}
                                className="items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-color"
                            >
                                <p className="text-sm font-bold">{clockIn.project_name}</p>
                                <p className="text-sm text-muted-foreground">{`${format(clockIn.time_in, 'h:mm a')} - ${clockIn.time_out === 'Active' ? clockIn.time_out : format(clockIn.time_out, 'h:mm a')}`}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}