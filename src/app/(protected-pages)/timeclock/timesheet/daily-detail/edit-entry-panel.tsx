"use client"

import { Button } from "@/components/ui/button"
import { DateTimePickerField } from "@/components/ui/date-time-picker-field"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-edit-timesheet-entry"
import { useGetTimesheetEntry } from "@/hooks/timeclock/timesheet-entries/use-get-timesheet-entry"
import { useDropdownStore } from "@/lib/stores/use-dropdown-store"
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store"
import { UpdateTimesheetEntryInput, UpdateTimesheetEntrySchema } from "@/lib/validation/timeclock"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCallback, useEffect } from "react"
import { ResponsivePanel } from "@/components/ui/responsive-panel"

interface EditEntryPanelProps {
  isOpen: boolean
  onOpenChange: (wasUpdated?: boolean) => void
}

export function EditEntryPanel({ isOpen, onOpenChange }: EditEntryPanelProps) {
  const { projects, timesheetTasks } = useDropdownStore()
  const { selectedEntryId } = useTimeclockSessionStore()
  const { data: timesheetEntry, isLoading, error } = useGetTimesheetEntry(Number(selectedEntryId))
  const { mutate: editTimesheet, isPending } = useEditTimesheetEntry()

  const form = useForm<UpdateTimesheetEntryInput>({
    resolver: zodResolver(UpdateTimesheetEntrySchema),
    defaultValues: {
      timesheet_entry_id: undefined,
      project_id: undefined,
      timesheet_task_id: undefined,
      time_in: new Date(),
      time_out: new Date(),
    },
  })

  useEffect(() => {
    if (timesheetEntry && isOpen) {
      form.reset({
        timesheet_entry_id: timesheetEntry.timesheet_entry_id,
        project_id: timesheetEntry.project_id ?? undefined,
        timesheet_task_id: timesheetEntry.timesheet_task_id ?? undefined,
        time_in: new Date(timesheetEntry.time_in),
        time_out: new Date(timesheetEntry.time_out),
      })
    }
  }, [timesheetEntry, isOpen, form])

  const handleCancel = useCallback(() => {
    form.reset()
    onOpenChange()
  }, [form, onOpenChange])

  const onSubmit = (data: UpdateTimesheetEntryInput) => {
    editTimesheet(data)
    onOpenChange(true)
  }

  if (isLoading) return null
  if (error) return <div>Error loading entry</div>

  return (
    <ResponsivePanel isOpen={isOpen} onClose={handleCancel} title="Edit Clock In">
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
              {isPending ? "Saving..." : "Save Changes"}
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
