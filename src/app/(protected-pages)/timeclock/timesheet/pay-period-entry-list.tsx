"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayPeriodTimesheetEntries } from "@/hooks/timeclock/timesheet-entries/use-pay-period-timesheet-entries";
import { useSubmitTimesheet } from "@/hooks/timeclock/timesheets/use-submit-timesheet";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { formatDuration } from "@/lib/utils/time-utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PayPeriodEntryList() {
    const { selectedPayPeriod, setSelectedDate, selectedTimesheet, setSelectedTimesheet } = useTimeclockSessionStore();
    const { data: timesheetEntries = [], isLoading, error } = usePayPeriodTimesheetEntries(selectedPayPeriod);
    const { mutate: submitTimesheet, isPending } = useSubmitTimesheet();
    const router = useRouter();

    useEffect(() => {
        if (!selectedPayPeriod || !timesheetEntries.length) return;

        const first = timesheetEntries[0];
        const newTimesheet = {
            timesheet_id: first.timesheet_id,
            status: first.status,
            pay_period_id: selectedPayPeriod.pay_period_id,
        };

        const current = selectedTimesheet;

        const isSame =
            current?.timesheet_id === newTimesheet.timesheet_id &&
            current?.status === newTimesheet.status &&
            current?.pay_period_id === newTimesheet.pay_period_id;

        if (!isSame) {
            setSelectedTimesheet(newTimesheet);
        }
    }, [timesheetEntries, selectedPayPeriod, selectedTimesheet, setSelectedTimesheet]);

    if (isLoading) return <p>Loading entries...</p>;
    if (error) return <p>Error loading entries...</p>;

    if (!selectedPayPeriod) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                Please select a pay period to view timesheet data.
            </div>
        );
    }

    if (timesheetEntries.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No timesheet data found for the selected pay period.
            </div>
        );
    }

    // Calculate total hours for the pay period
    const totalPayPeriodHours = timesheetEntries.reduce((sum, day) => sum + day.total_hours, 0);

    // TImsheet status
    const status = timesheetEntries[0].status;
    const timesheetId = timesheetEntries[0].timesheet_id;

   
    

    const backgroundColor = status === 'Open'
        ? "bg-sky-600/50"
        : status === 'Submitted'
        ? "bg-amber-200/50"
        : status === "Rejected"
        ? "bg-red-500/50"
        : status === "Approved"
        ? "bg-green-500/50"
        : "bg-gray/50";

    const handleCardClick = (date: string) => {
        setSelectedDate(date);
        router.push("/timeclock/timesheet/daily-detail");
    }

    return (
        <div className="space-y-4">
            <Card className={backgroundColor}>
                <CardHeader>
                    <CardTitle>Timesheet Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        Total: {formatDuration(totalPayPeriodHours)}
                        <span className="ml-2">
                            ({format(selectedPayPeriod.start_date, "MMM d, yyyy")} - {format(selectedPayPeriod.end_date, "MMM d, yyyy")})
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Status: {status}
                    </div>
                    {status === 'Open' || status === 'Rejected' ? (
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                if (!timesheetId) return;
                                submitTimesheet(timesheetId);
                            }}
                            disabled={isPending}
                        >
                            {isPending ? "Submitting..." : "Submit Timesheeet"}
                        </Button>
                    ) : (
                        <div />
                    )}
                </CardContent>
            </Card>

            {timesheetEntries.map((day) => {
                const date = new Date(day.date + 'T00:00:00');
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                    <Card
                        key={day.date}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => handleCardClick(day.date)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCardClick(day.date);
                            }
                        }}
                        tabIndex={0}
                        role="button"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                {dayOfWeek}, {formattedDate}
                                {isWeekend && (
                                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                        Weekend
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div>
                                <p>Total Punches: {day.total_punches}</p>
                            </div>
                            <div>
                                <p>Total Hours: {formatDuration(day.total_hours)}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}