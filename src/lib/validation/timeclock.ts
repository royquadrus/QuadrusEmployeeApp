import { number, string, z } from "zod";

export const timesheetEntrySchema = z.object({
    timesheet_id: z.number().positive(),
    project_id: z.number().positive().optional(),
    timesheet_task_id: z.number().positive().optional(),
    entry_date: z.string().date(), // ISO date string (YYYY-MM-DD)
    time_in: z.string().datetime(), // ISO datetime string
    time_out: z.string().datetime().optional(),
    duration: z.number().optional(),
    mintues_paid: z.number().optional(),
    minutes_banked: z.number().optional(),
});

export const BasicTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number(),
    time_in: z.string(),
    time_out: z.string(),
    project_name: z.string(),
    task_name: z.string(),
    duration: z.number(),
});

export const ClockInFormSchema = z.object({
    timesheet_id: z.number(),
    project_id: z.coerce.number(),
    timesheet_task_id: z.coerce.number(),
});

export const FullClockInSchema = ClockInFormSchema.extend({
    time_in: z.string(),
});

export const clockOutSchema = z.object({
    timesheet_entry_id: z.number().positive(),
    time_out: z.string().datetime(),
});

export const fullTimesheetEntrySchema = z.object({
    timesheet_entry_id: z.number().optional(),
    timesheet_id: z.number(),
    project_id: z.number().optional(),
    timesheet_task_id: z.number().optional(),
    entry_date: z.string().optional(),
    time_in: z.string().optional(),
    time_out: z.string().optional(),
    duration: z.number().optional(),
    updated_at: z.string().optional(),
})

export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;
export type ClockOutFormData = z.infer<typeof clockOutSchema>;
export type FullTimesheetEntryFormData = z.infer<typeof fullTimesheetEntrySchema>;
export type ClockInFormInput = z.infer<typeof ClockInFormSchema>;
export type FullClockInInput = z.infer<typeof FullClockInSchema>;
export type BasicTimesheetEntry = z.infer<typeof BasicTimesheetEntrySchema>;