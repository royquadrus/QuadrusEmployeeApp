import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { useQuery } from "@tanstack/react-query";

export function useGetDailyPunches() {
    const selectedDate = useTimeclockSessionStore((s) => s.selectedDate);

    return useQuery({
        queryKey: ["daily-punches", selectedDate],
        queryFn: async () => {
            if (!selectedDate) return [];

            const response = await fetch(`/api/timeclock/timesheet-entries/get-daily-punches?day=${selectedDate}`);
            if (!response.ok) throw new Error("Failed to fetch daily clock ins");

            return response.json();
        },
        enabled: !!selectedDate, // only fetch when valid
    });
}