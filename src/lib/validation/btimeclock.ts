import { z } from "zod";

export const TimesheetSchema = z.object({
    timesheet_id: z.number(),
    pay_period_id: z.string(),
    status: z.string(),
});

export const PayPeriodSchema = z.object({
    pay_period_id: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

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

export type Timesheet = z.infer<typeof TimesheetSchema>;
export type PayPeriod = z.infer<typeof PayPeriodSchema>
export type ActiveEntry = z.infer<typeof ActiveEntrySchema>;