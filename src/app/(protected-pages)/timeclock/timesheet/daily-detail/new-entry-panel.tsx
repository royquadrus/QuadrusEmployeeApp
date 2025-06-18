"use client"

import { Button } from "@/components/ui/button"
import { DateTimePickerField } from "@/components/ui/date-time-picker-field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-create-timesheet-entry"
import { useDropdownStore } from "@/lib/stores/use-dropdown-store"
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store"
import { CreateTimesheetEntryInput, CreateTimesheetEntrySchema } from "@/lib/validation/timeclock"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCallback, useEffect } from "react"
import { ResponsivePanel } from "@/components/ui/responsive-panel"

interface NewEntryPanelProps {
  isOpen: boolean
  onOpenChange: () => void
}

export function NewEntryPanel({ isOpen, onOpenChange }: NewEntryPanelProps) {
  const { projects, timesheetTasks } = useDropdownStore()
  const { selectedDate, selectedTimesheet } = useTimeclockSessionStore()
  const { mutate: createEntry, isPending } = useCreateTimesheetEntry()

  const getDateTimeWithCurrentTime = (dateString: string) => {
    const now = new Date()
    const base = new Date(`${dateString}T00:00:00`)
    base.setHours(now.getHours())
    base.setMinutes(now.getMinutes())
    base.setSeconds(0)
    base.setMilliseconds(0)
    return base
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
  })

  useEffect(() => {
    if (isOpen) {
      const now = getDateTimeWithCurrentTime(selectedDate)
      form.reset({
        timesheet_id: selectedTimesheet.timesheet_id || undefined,
        project_id: undefined,
        timesheet_task_id: undefined,
        time_in: now,
        time_out: now,
      })
    }
  }, [isOpen, selectedDate, selectedTimesheet, form])

  const handleCancel = useCallback(() => {
    form.reset()
    onOpenChange()
  }, [form, onOpenChange])

  const onSubmit = (data: CreateTimesheetEntryInput) => {
    createEntry(data)
    onOpenChange()
  }

  return (
    <ResponsivePanel isOpen={isOpen} onClose={handleCancel} title="New Clock In">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
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
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timesheetTasks.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.label}
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
            name="time_in"
            render={({ field }) => (
              <DateTimePickerField field={field} label="Time In" />
            )}
          />

          <FormField
            control={form.control}
            name="time_out"
            render={({ field }) => (
              <DateTimePickerField field={field} label="Time Out" />
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "New Clock In"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </ResponsivePanel>
  )
}
