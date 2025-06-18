"use client"

import { ControllerRenderProps } from "react-hook-form"
import { Calendar } from "@/components/ui/calendar"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"

export function DateTimePickerField({
  field,
  label,
}: {
  field: ControllerRenderProps<any, any>
  label: string
}) {
  const [tempDate, setTempDate] = useState<Date>(field.value ?? new Date())

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    const updated = new Date(date)
    updated.setHours(tempDate.getHours())
    updated.setMinutes(tempDate.getMinutes())
    setTempDate(updated)
    field.onChange(updated)
  }

  const handleTimeChange = (key: "hour" | "minute", val: number) => {
    const newDate = new Date(tempDate)
    if (key === "hour") newDate.setHours(val)
    else newDate.setMinutes(val)
    setTempDate(newDate)
    field.onChange(newDate)
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        <Calendar mode="single" selected={tempDate} onSelect={handleDateChange} />
        <div className="flex gap-2">
          <select
            value={tempDate.getHours()}
            onChange={(e) => handleTimeChange("hour", Number(e.target.value))}
            className="p-2 border rounded-md w-full"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, "0")}</option>
            ))}
          </select>
          <span className="text-xl font-bold">:</span>
          <select
            value={tempDate.getMinutes()}
            onChange={(e) => handleTimeChange("minute", Number(e.target.value))}
            className="p-2 border rounded-md w-full"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, "0")}</option>
            ))}
          </select>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  )
}
