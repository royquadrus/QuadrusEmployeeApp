import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSubmitTimesheet() {
    const queryClient = useQueryClient();
    const payPeriod = useTimeclockSessionStore((s) => s.selectedPayPeriod);

    return useMutation({
        mutationFn: async (input: number) => {
            const response = await fetch("/api/timeclock/timesheets/submit-timesheet", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to submit timesheet");

            return data;
        },
        onSuccess: () => {
            toast.success("Timesheet submitted");
            queryClient.invalidateQueries({ queryKey: ["pay-period-timesheet-entries", payPeriod?.pay_period_id] });
        },
        onError: (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to submit timesheet");
        }
    })
}