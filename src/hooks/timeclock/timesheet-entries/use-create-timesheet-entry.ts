import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { CreateTimesheetEntryInput } from "@/lib/validation/timeclock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateTimesheetEntry() {
    const queryClient = useQueryClient();
    const selectedDate = useTimeclockSessionStore((s) => s.selectedDate);
    const payPeriod = useTimeclockSessionStore((s) => s.currentPayPeriod);

    return useMutation({
        mutationFn: async (input: CreateTimesheetEntryInput) => {
            console.log("HOOK:", input);
            const response = await fetch("/api/timeclock/timesheet-entries/create-timesheet-entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to create timesheet entry");

            return data;
        },
        onSuccess: () => {
            toast.success("Clock in created");
            queryClient.invalidateQueries({ queryKey: ["daily-punches", selectedDate]});
            queryClient.invalidateQueries({ queryKey: ["pay-period-timesheet-entries", payPeriod?.pay_period_id]});
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to create clock in");
        }
    })
}