import { z } from "zod";

export const BaseTimesheetSchema = z.object({
    timesheet_id: z.number(),
    pay_period_id: z.string(),
    status: z.string(),
});

export const PayPeriodSchema = z.object({
    pay_period_id: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

export const BaseTimesheetEntrySchema = z.object({
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

export const FullTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.coerce.string(),
    time_in: z.string(),
    time_out: z.string().nullable().optional(),
    duration: z.number().nullable().optional(),
    entry_date: z.string(),
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
    time_out: data.time_out
        ? data.time_out
        : "Active",
    duration: data.duration
        ? data.duration
        : 0,
    entry_date: data.entry_date,
    project_name: data.pm_projects.project_number
        ? `${data.pm_projects.project_number} - ${data.pm_projects.project_name}`
        : data.pm_projects.project_name,
    task_name: data.hr_timesheet_tasks.task_name,
}));

export const ClockInFormSchema = z.object({
    timesheet_id: z.number(),
    project_id: z.coerce.number(),
    timesheet_task_id: z.coerce.number(),
});

export const FullClockInSchema = ClockInFormSchema.extend({
    time_in: z.string(),
});

export const CreateTimesheetEntrySchema = z.object({
    timesheet_id: z.coerce.number(),
    project_id: z.coerce.number(),
    timesheet_task_id: z.coerce.number(),
    time_in: z.date(),
    time_out: z.date(),
});

export const UpdateTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number(),
    project_id: z.coerce.number(),
    timesheet_task_id: z.coerce.number(),
    time_in: z.date(),
    time_out: z.date(),
});

export type BaseTimesheet = z.infer<typeof BaseTimesheetSchema>;
export type PayPeriod = z.infer<typeof PayPeriodSchema>;
export type BaseTimesheetEntry = z.infer<typeof BaseTimesheetEntrySchema>;
export type FullTimesheetEntry = z.infer<typeof FullTimesheetEntrySchema>;
export type ClockInFormInput = z.infer<typeof ClockInFormSchema>;
export type FullClockInInput = z.infer<typeof FullClockInSchema>;
export type CreateTimesheetEntryInput = z.infer<typeof CreateTimesheetEntrySchema>;
export type UpdateTimesheetEntryInput = z.infer<typeof UpdateTimesheetEntrySchema>;