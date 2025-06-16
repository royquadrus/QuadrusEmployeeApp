import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { ActiveEntry } from "@/lib/validation/timesheet-entry";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useActiveEntry() {
    const setActiveEntry = useTimeclockSessionStore((state) => state.setActiveEntry);
    const { currentTimesheet } = useTimeclockSessionStore();

    const query = useQuery<ActiveEntry | null, Error>({
        queryKey: ["active-entry"],
        queryFn: async () => {
            const response = await fetch("/api/timeclock/active-entry", {
                method: "POST",
                body: JSON.stringify({ timesheet_id: currentTimesheet?.timesheet_id }),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch active clock-in entry");
            }
            return response.json();
        },
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
    });

    useEffect(() => {
        if (query.status === "success") {
            setActiveEntry(query.data);
        }
    }, [query.status, query.data, setActiveEntry]);

    return query;
}