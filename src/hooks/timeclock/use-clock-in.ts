import { FullClockInInput } from "@/lib/validation/timeclock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClockIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: FullClockInInput) => {
            const response = await fetch("/api/timeclock/timesheet-entries/clock-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to clock in");

            return data;
        },
        onSuccess: (data) => {
            toast.success("Clocked in successfully");
            queryClient.invalidateQueries({ queryKey: ["active-entry"] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to clock in");
        }
    });
}