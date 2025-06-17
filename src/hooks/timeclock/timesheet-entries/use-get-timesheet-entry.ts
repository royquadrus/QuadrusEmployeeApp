import { useQuery } from "@tanstack/react-query";

export function useGetTimesheetEntry(timesheetEntryId: number) {
    return useQuery({
        queryKey: ["timesheet-entry", timesheetEntryId],
        queryFn: async () => {
            if (!timesheetEntryId) return;

            const response = await fetch(`/api/timeclock/timesheet-entries/get-timesheet-entry?timesheetEntryId=${timesheetEntryId}`);
            if (!response.ok) throw new Error("Failed to fetch timesheet entry");

            return response.json();
        },
        enabled: !!timesheetEntryId,
    })
}