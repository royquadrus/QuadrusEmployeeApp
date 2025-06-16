import { z } from "zod";

export const ActiveEntrySchema = z.object({
    timesheet_entry_id: z.coerce.string(),
    time_in: z.string(),
    pm_projects: z.object({
        project_number: z.string().nullable().optional(),
        project_name: z.string(),
    }),
    hr_timesheet_tasks: z.object({
        task_name: z.string(),
    }),
}).transform((data) => ({
    timesheet_entry_id: data.timesheet_entry_id,
    time_in: data.time_in,
    project_name: data.pm_projects.project_number
        ? `${data.pm_projects.project_number} - ${data.pm_projects.project_name}`
        : data.pm_projects.project_name,
    task_name: data.hr_timesheet_tasks.task_name,
}));

export const editTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().positive(),
    project_id: z.string(),
    timesheet_task_id: z.string(),
    time_in: z.date(),
    time_out: z.date(),
    entry_date: z.date(),
});

export const newTimesheetEntrySchema = z.object({
    project_id: z.string(),
    timesheet_task_id: z.string(),
    timesheet_id: z.number(),
    time_in: z.date(),
    time_out: z.date(),
    entry_date: z.date(),
});

export type ActiveEntry = z.infer<typeof ActiveEntrySchema>;
export type EditTimesheetEntryFormData = z.infer<typeof editTimesheetEntrySchema>;
export type NewTimesheetEntryFormData = z.infer<typeof newTimesheetEntrySchema>;