import { BasicTimesheetEntry } from "@/lib/validation/timeclock";
import { useQuery } from "@tanstack/react-query";

export function useTodaysClockIns(currentTimesheetId: number) {
    return useQuery<BasicTimesheetEntry[]>({
        queryKey: ["todays-clock-ins", currentTimesheetId],
        queryFn: async ({ queryKey }) => {
            const [, currentTimesheetId] = queryKey;
            const response = await fetch(`/api/timeclock/timesheet-entries/todays-clock-ins?timesheetId=${currentTimesheetId}`);

            if (!response.ok) throw new Error("Failed to fetch todays clock ins");

            return response.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}