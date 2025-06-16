"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClockOut } from "@/hooks/timeclock/use-clock-out";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { useEffect, useState } from "react";

export function ClockedInCard() {
    const { activeEntry } = useTimeclockSessionStore();
    const { mutate: clockOut, isPending } = useClockOut();

    const [elapsedTime, setElapsedTime] = useState(0);

    const formatElapsedTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            secs.toString().padStart(2, "0")
        ].join(":");
    };

    useEffect(() => {
        if (!activeEntry?.time_in) return;

        const startTime = new Date(activeEntry.time_in);
        const now = new Date();
        const initialElapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(initialElapsedSeconds);

        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeEntry?.time_in]);

    if (!activeEntry) {
        return null;
    }

    return (
        <Card>
            <CardContent>
                <div className="flex mb-4 items-center gap-2">
                    <p className="w-24 text-end text-sm font-bold whitespace-nowrap">Working On:</p>
                    <p className="text-xs font-medium break-words">{activeEntry.project_name}</p>
                </div>
                <div className="flex mb-4 items-center gap-2">
                    <p className="w-24 text-end text-sm font-bold whitespace-nowrap">Task:</p>
                    <p className="text-xs font-medium break-words">{activeEntry.task_name}</p>
                </div>
                <div className="mb-4 text-3xl font-bold text-center">{formatElapsedTime(elapsedTime)}</div>
                <Button
                    className="w-full"
                    onClick={() => clockOut(activeEntry)}
                    disabled={isPending}
                    variant="destructive"
                >
                    {isPending ? "Clocking Out..." : "Clock Out"}
                </Button>
            </CardContent>
        </Card>
    );
}