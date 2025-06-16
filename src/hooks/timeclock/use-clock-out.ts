import { ActiveEntry } from "@/lib/validation/btimeclock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClockOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: ActiveEntry) => {
            const response = await fetch("/api/timeclock/timesheet-entries/clock-out", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to clock out");

            return;
        },
        onSuccess: () => {
            toast.success("Clocked out successfully");
            queryClient.invalidateQueries({ queryKey: ["active-entry"] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to clock out");
        }
    })
}