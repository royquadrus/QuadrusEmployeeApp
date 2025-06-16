"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodaysClockIns } from "@/hooks/timeclock/use-todays-clock-ins";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";

export function TodaysClockIns() {
    const { currentTimesheet } = useTimeclockSessionStore();
    const { data: todaysClockIns, isLoading } = useTodaysClockIns(currentTimesheet.timesheet_id);

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
                                <p className="font-bold text-xl">{clockIn.project_name}</p>
                                <p className="text-sm">{clockIn.time_in} - {clockIn.time_out}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}