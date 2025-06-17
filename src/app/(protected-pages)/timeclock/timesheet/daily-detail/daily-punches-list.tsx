"use client";

import { useGetDailyPunches } from "@/hooks/timeclock/timesheet-entries/use-get-daily-punches";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { format } from "date-fns";
import DailyDetailSkeleton from "./daily-detail-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils/time-utils";
import { useCallback, useState } from "react";
import { EditEntryDrawer } from "./edit-entry-drawer";
import { Button } from "@/components/ui/button";
import { NewEntryDrawer } from "./new-entry-drawer";

export function DailyPunchesList() {
    const { selectedDate, setSelectedEntryId, selectedTimesheet } = useTimeclockSessionStore();
    const { data: dailyClockIns, isLoading, error } = useGetDailyPunches();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);

    const isTimesheetLocked = selectedTimesheet.status === "Approved" || selectedTimesheet.status === "Submitted";

    const handleCardClick = (id: string) => {
        if (isTimesheetLocked) return;

        setSelectedEntryId(id);
        setIsEditDrawerOpen(true);
    }

    const handleEditDrawerClose = useCallback(() => {
        setIsEditDrawerOpen(false);
        setSelectedEntryId(null);
    }, [setSelectedEntryId]);

    const handleNewDrawerOpen = () => {
        if (isTimesheetLocked) return;

        setIsNewDrawerOpen(true);
    }

    const handleNewDrawerClose = useCallback(() => {
        setIsNewDrawerOpen(false);
    }, [setIsNewDrawerOpen]);

    return (
        <div className="space-y-2">
            <div className="items-center">
                <h2 className="textxl font-bold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'iii, MMM, d')}</h2>
                <h3 className="text-lg font-semibold text-center">{format(new Date(selectedDate + 'T00:00:00'), 'EEEE')}&apos;s Clock In&apos;s</h3>
            </div>
            {isLoading ? (
                <div className="p-2 space-y-3">
                {[...Array(4)].map((_, i) => (
                    <DailyDetailSkeleton key={i} />
                ))}
            </div>
            ) : error ? (
                <div className="text-center py-4 text-destructive">
                    Error loading data
                </div>
            ) : (
                dailyClockIns.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No timesheet entries for selected day.
                    </div>
            ) : (
                dailyClockIns.map((clockIn) => (
                    <Card
                        key={clockIn.timesheet_entry_id}
                        className={`transition-all duration-200 ${
                            isTimesheetLocked
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        }`}
                        onClick={() => handleCardClick(clockIn.timesheet_entry_id)}
                        tabIndex={0}
                        role="button"
                    >
                        <CardContent>
                            <div className="text-lg font-bold">{clockIn.project_name}</div>
                            <div className="flex gap-4">
                                <div className="font-bold">
                                    <p>Time In:</p>
                                    <p>TIme Out:</p>
                                    <p>Total:</p>
                                </div>
                                <div>
                                    <p>{format(clockIn.time_in, "h:mm a")}</p>
                                    <p>{format(clockIn.time_out, "h:mm a")}</p>
                                    <p>{formatDuration(clockIn.duration)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )
            )}

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleNewDrawerOpen}
                disabled={isTimesheetLocked}
                title={isTimesheetLocked ? "Cannot add entries to approved/submitted timesheets" : "Add new clock in"}
            >
                Add New Clock In
            </Button>

            <EditEntryDrawer
                isOpen={isEditDrawerOpen}
                onOpenChange={handleEditDrawerClose}
            />

            <NewEntryDrawer
                isOpen={isNewDrawerOpen}
                onOpenChange={handleNewDrawerClose}
            />
        </div>
    );
}