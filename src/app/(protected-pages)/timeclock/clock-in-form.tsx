"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClockIn } from "@/hooks/timeclock/use-clock-in";
import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { ClockInFormInput, ClockInFormSchema } from "@/lib/validation/timeclock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function ClockInForm() {
    const { currentTimesheet } = useTimeclockSessionStore();
    const { projects, timesheetTasks } = useDropdownStore();
    const { mutate: clockIn, isPending } = useClockIn();

    const form = useForm({
        resolver: zodResolver(ClockInFormSchema),
        defaultValues: {
            timesheet_id: currentTimesheet.timesheet_id,
            project_id: undefined,
            timesheet_task_id: undefined,
        },
    });

    const onSubmit = (data: ClockInFormInput) => {
        const clockInData = {
            ...data,
            time_in: new Date().toISOString(),
        };
        clockIn(clockInData);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value?.toString() ?? ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {projects.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="timesheet_task_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task</FormLabel>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                value={field.value?.toString() ?? ""}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a task" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {timesheetTasks.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Clocking in..." : "Clock In"}
                </Button>
            </form>
        </Form>
    );
}