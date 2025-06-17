import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayPeriodSelect } from "./pay-period-select";
import { PayPeriodEntryList } from "./pay-period-entry-list";

export default function TimesheetPage() {
    return (
        <div className="container mx-auto py-4 space-y-2">
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
    );
}