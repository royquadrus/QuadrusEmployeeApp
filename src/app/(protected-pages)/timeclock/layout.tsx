"use client";

import { ModuleNav } from "@/components/navigation/module-nav";
import { useActiveEntry } from "@/hooks/timeclock/timesheet-entries/use-active-entry";
import { CalendarDays, Clock } from "lucide-react";

const timeClockNavItems = [
    {
        name: "Clock",
        href: "/timeclock",
        icon: <Clock className="h-4 w-4" />,
    },
    {
        name: "Timesheets",
        href: "/timeclock/timesheet",
        icon: <CalendarDays className="h-4 w-4" />
    }
];

export default function TimeclockLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useActiveEntry();
    return (
        <div>
            <ModuleNav items={timeClockNavItems} basePath="/timeclock" />
            <div className="p-4">{children}</div>
        </div>
    )
}