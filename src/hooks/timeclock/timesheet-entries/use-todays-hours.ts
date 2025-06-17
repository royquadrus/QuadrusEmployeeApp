import { useQuery } from "@tanstack/react-query";

export function useTodaysHours(employeeId: number) {
    return useQuery({
        queryKey: ["todays-hours", employeeId],
        queryFn: async ({ queryKey }) => {
            const [, employeeId] = queryKey;
            const response = await fetch("/api/timeclock/timesheet-entries/todays-hours", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId }),
            });

            if (!response.ok) throw new Error("Failed to fetch todays hours");

            return response.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}