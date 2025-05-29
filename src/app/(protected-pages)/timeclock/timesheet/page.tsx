"use client";

import { PayPeriodEntryList } from "@/components/timeclock/timesheet/pay-period-entry-list";
import { PayPeriodSelect } from "@/components/timeclock/timesheet/pay-period-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TimesheetPage() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                    <PayPeriodSelect />
                </CardContent>
            </Card>
            <PayPeriodEntryList />
        </div>
    )
}