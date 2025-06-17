import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { UpdateTimesheetEntryInput } from "@/lib/validation/timeclock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useEditTimesheetEntry() {
    const queryClient = useQueryClient();
    const selectedDate = useTimeclockSessionStore((s) => s.selectedDate);
    const payPeriod = useTimeclockSessionStore((s) => s.selectedPayPeriod);

    return useMutation({
        mutationFn: async (input: UpdateTimesheetEntryInput) => {
            const response = await fetch("/api/timeclock/timesheet-entries/edit-timesheet-entry", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update timesheet entry");

            return data;
        },
        onSuccess: () => {
            toast.success("Clock in updated");
            queryClient.invalidateQueries({ queryKey: ["daily-punches", selectedDate]});
            queryClient.invalidateQueries({ queryKey: ["pay-period-timesheet-entries", payPeriod?.pay_period_id]});
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to update clock in");
        }
    })
}