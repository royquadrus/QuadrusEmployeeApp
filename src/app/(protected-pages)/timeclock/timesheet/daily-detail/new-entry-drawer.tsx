"use client";

import { Button } from "@/components/ui/button";
import { DateTimePickerField } from "@/components/ui/date-time-picker-field";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-create-timesheet-entry";
import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { CreateTimesheetEntryInput, CreateTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface NewEntryDrawerProps {
    isOpen: boolean;
    onOpenChange: () => void;
}

export function NewEntryDrawer({ isOpen, onOpenChange }: NewEntryDrawerProps) {
    const { projects, timesheetTasks } = useDropdownStore();
    const { selectedDate, selectedTimesheet } = useTimeclockSessionStore();
    const { mutate: createEntry, isPending } = useCreateTimesheetEntry();

    const getDateTimeWithCurrentTime = (dateString: string) => {
        const now = new Date();
        const selectedDateTime = new Date(dateString + 'T00:00:00');

        selectedDateTime.setHours(now.getHours());
        selectedDateTime.setMinutes(now.getMinutes());
        selectedDateTime.setSeconds(now.getSeconds());
        selectedDateTime.setMilliseconds(now.getMilliseconds());

        return selectedDateTime;
    }

    const form = useForm<CreateTimesheetEntryInput>({
        resolver: zodResolver(CreateTimesheetEntrySchema),
        defaultValues: {
            timesheet_id: selectedTimesheet.timesheet_id || undefined,
            project_id: undefined,
            timesheet_task_id: undefined,
            time_in: getDateTimeWithCurrentTime(selectedDate),
            time_out: getDateTimeWithCurrentTime(selectedDate),
        },
    });

    useEffect(() => {
        if (isOpen) {
            const defaultDateTime = getDateTimeWithCurrentTime(selectedDate);
            form.reset({
                timesheet_id: selectedTimesheet.timesheet_id || undefined,
                project_id: undefined,
                timesheet_task_id: undefined,
                time_in: defaultDateTime,
                time_out: defaultDateTime,
            });
        }
    }, [isOpen, selectedDate, selectedTimesheet, form]);

    const handleCancel = useCallback(() => {
        form.reset();
        onOpenChange();
    }, [form, onOpenChange]);

    const onSubmit = async (data: CreateTimesheetEntryInput) => {
        try {
            createEntry(data);
            onOpenChange();
        } catch (error) {
            console.error("Error creating timesheet entry:", error);
        }
    };    

    return (
        <Drawer
            direction="right"
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onOpenChange();
                }
            }}
        >
            <DrawerContent className="max-w-2xl mx-auto">
                <DrawerHeader>
                    <DrawerTitle>New Clock In</DrawerTitle>
                </DrawerHeader>
            

                <div className="p-6 max-h-[80vh] overflow-y-auto">
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
                                            <SelectContent className="bg-popover border border-border shadow-lg backdrop-blue-sm">
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
                                            <SelectContent className="bg-popover border border-border shadow-lg backdrop-blur-sm">
                                                
                                                {timesheetTasks.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={t.id.toString()}
                                                    >
                                                        {t.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DateTimePickerField
                                name="time_in"
                                label="Time In"
                            />

                            <DateTimePickerField
                                name="time_out"
                                label="Time Out"
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                >
                                    {isPending ? "Saving..." : "New Clock In"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}