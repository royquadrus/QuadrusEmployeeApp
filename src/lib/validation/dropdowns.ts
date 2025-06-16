import { z } from "zod";

export const DropdownProjectSchema = z.object({
    project_id: z.coerce.string(),
    project_number: z.string().optional(),
    project_name: z.string(),
}).transform((data) => ({
    project_id: data.project_id,
    project_name: data.project_number
        ? `${data.project_number} - ${data.project_name}`
        : data.project_name,
}));

export const DropdownTimesheetTaskSchema = z.object({
    timesheet_task_id: z.coerce.string(),
    task_name: z.string(),
});

export type Project = z.infer<typeof DropdownProjectSchema>;
export type TimesheetTask = z.infer<typeof DropdownTimesheetTaskSchema>;