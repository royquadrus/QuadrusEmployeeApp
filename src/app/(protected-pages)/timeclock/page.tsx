"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { ClockInForm } from "./clock-in-form";
import { ClockedInCard } from "./clocked-in-card";
import { TodaysClockIns } from "./todays-clock-ins";

export default function TimeClockPage() {
    const { activeEntry } = useTimeclockSessionStore();

    return (
        <div className="container mx-auto py-8 space-y-8">
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