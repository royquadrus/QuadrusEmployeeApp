"use client";

import { Button } from "@/components/ui/button";
import { DateTimePickerField } from "@/components/ui/date-time-picker-field";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-edit-timesheet-entry";
import { useGetTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-get-timesheet-entry";
import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";
import { UpdateTimesheetEntryInput, UpdateTimesheetEntrySchema } from "@/lib/validation/timeclock";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditEntryDrawerProps {
    isOpen: boolean;
    onOpenChange: (wasUpdated?: boolean) => void;
}

export function EditEntryDrawer({ isOpen, onOpenChange }: EditEntryDrawerProps) {
    const { projects, timesheetTasks } = useDropdownStore();
    const { selectedEntryId } = useTimeclockSessionStore();
    const {data: timesheetEntry, isLoading, error } = useGetTimesheetEntry(Number(selectedEntryId));
    const { mutate: editTimesheet, isPending } = useEditTimesheetEntry();

    const form = useForm<UpdateTimesheetEntryInput>({
        resolver: zodResolver(UpdateTimesheetEntrySchema),
        defaultValues: {
            timesheet_entry_id: undefined,
            project_id: undefined,
            timesheet_task_id: undefined,
            time_in: new Date(),
            time_out: new Date(),
        }
    });

    useEffect(() => {
        if (timesheetEntry && isOpen) {
            form.reset({
                timesheet_entry_id: timesheetEntry.timesheet_entry_id,
                project_id: timesheetEntry.project_id ?? undefined,
                timesheet_task_id: timesheetEntry.timesheet_task_id ?? undefined,
                time_in: timesheetEntry.time_in ? new Date(timesheetEntry.time_in) : new Date(),
                time_out: timesheetEntry.time_out ? new Date(timesheetEntry.time_out) : new Date(),
            });
        }
    }, [timesheetEntry, isOpen, form]);

    const handleCancel = useCallback(() => {
        form.reset();
        onOpenChange();
    }, [form, onOpenChange]);

    const onSubmit = async (data: UpdateTimesheetEntryInput) => {
        try {
            editTimesheet(data);
            onOpenChange();
        } catch (error) {
            console.error("Error editing timesheet entry:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error loading timesheet</div>;

    return (
        <Drawer
            direction="left"
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onOpenChange();
                }
            }}
        >
            <DrawerContent className="max-w-2xl mx-auto">
                <DrawerHeader>
                    <DrawerTitle>Edit Clock In</DrawerTitle>
                </DrawerHeader>

                <div className="p-4-max-h-[80vh] overlfow-y-auto">
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
                                    {isPending ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isPending}
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