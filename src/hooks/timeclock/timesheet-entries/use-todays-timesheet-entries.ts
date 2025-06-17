import { FullTimesheetEntry } from "@/lib/validation/timeclock";
import { useQuery } from "@tanstack/react-query";

export function useTodaysTimesheetEntries(currentTimesheetId: number) {
    return useQuery<FullTimesheetEntry[]>({
        queryKey: ["todays-clock-ins", currentTimesheetId],
        queryFn: async ({ queryKey }) => {
            const [, currentTimesheetId] = queryKey;
            const response = await fetch(`/api/timeclock/timesheet-entries/todays-clockins?timesheetId=${currentTimesheetId}`);

            if (!response.ok) throw new Error("Failed to fetch todays clock ins");

            return response.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}