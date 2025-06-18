import { PayPeriod } from "@/lib/validation/timeclock";
import { useQuery } from "@tanstack/react-query";

export function usePayPeriodTimesheetEntries(payPeriod: PayPeriod | null | undefined) {
    return useQuery({
        queryKey: ["pay-period-timesheet-entries", payPeriod?.pay_period_id],
        queryFn: async () => {
            if (!payPeriod?.pay_period_id) return [];

            const response = await fetch(`/api/timeclock/timesheet-entries/pay-period-timesheet-entries?payPeriodId=${payPeriod.pay_period_id}`);
            if (!response.ok) throw new Error("Failed to fetch pay period timesheet entries.");

            return response.json();
        },
        enabled: !!payPeriod?.pay_period_id, // only fetch when valid
    });
}