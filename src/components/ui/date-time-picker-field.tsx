"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { cn } from "@/lib/utils";

interface DateTimePickerFieldProps {
    name: string;
    label: string;
    allowClear?: boolean;
    format12Hour?: boolean;
}

export function DateTimePickerField({
    name,
    label,
    allowClear = true,
    format12Hour = true
}: DateTimePickerFieldProps) {
    const { control, setValue } = useFormContext();
    const [open, setOpen] = useState(false);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => {
                const value: Date | null = field.value ? new Date(field.value) : null;

                const handleDateSelect = (date: Date | undefined) => {
                    if (!date) return;

                    const newDate = value ? new Date(date) : date;
                    if (value) {
                        newDate.setHours(value.getHours());
                        newDate.setMinutes(value.getMinutes());
                        newDate.setSeconds(0);
                    }
                    setValue(name, newDate.toISOString());
                    setOpen(false);
                };

                const handleTimeChange = (type: "hour" | "minute" | "ampm", val: string) => {
                    if (!value) return;
                    const newDate = new Date(value);

                    if (type === "hour") {
                        let hour = parseInt(val, 10);
                        if (format12Hour) {
                            const isPM = newDate.getHours() >= 12;
                            hour = isPM ? (hour % 12) + 12 : hour % 12;
                        }
                        newDate.setHours(hour);
                    } else if (type === "minute") {
                        newDate.setMinutes(parseInt(val, 10));
                    } else if (type === "ampm") {
                        const hour = newDate.getHours();
                        if (val === "AM" && hour >= 12) newDate.setHours(hour - 12);
                        else if (val === "PM" && hour < 12) newDate.setHours(hour + 12);
                    }

                    //setValue(name, newDate.toISOString());
                    setValue(name, newDate);
                };

                const display = value ? format(value, format12Hour ? "MM/dd/yyyy hh:mm aa" : "MM/dd/yyyy HH:mm") : "Pick date & time";

                return (
                    <FormItem>
                        <FormLabel className="flex justify-between items-center">
                            {label}
                            {allowClear && value && (
                                <button
                                    type="button"
                                    className="text-xs text-muted-foreground underline"
                                    onClick={() => setValue(name, null)}
                                >
                                    Clear
                                </button>
                            )}
                        </FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className={cn("w-full justify-start", !value && "text-muted-foreground")}>
                                        {display}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                <div className="sm:flex">
                                    <Calendar
                                        mode="single"
                                        selected={value || undefined}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                    />
                                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex sm:flex-col p-2">
                                                {Array.from({ length: format12Hour ? 12 : 24 }, (_, i) =>
                                                    format12Hour ? i + 1 : i
                                                ).map((hour) => (
                                                    <Button
                                                        key={hour}
                                                        size="icon"
                                                        type="button"
                                                        variant={
                                                            value &&
                                                            (format12Hour
                                                                ? value.getHours() % 12 === hour % 12
                                                                : value.getHours() === hour)
                                                                ? "default"
                                                                : "ghost"
                                                        }
                                                        className="sm:w-full aspect-square"
                                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                                    >
                                                        {format12Hour ? hour : hour.toString().padStart(2, "0")}
                                                    </Button>
                                                ))}
                                            </div>
                                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                                        </ScrollArea>
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex sm:flex-col p-2">
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <Button
                                                        key={i}
                                                        size="icon"
                                                        type="button"
                                                        variant={value && value.getMinutes() === i ? "default" : "ghost"}
                                                        className="sm:w-full aspect-square"
                                                        onClick={() => handleTimeChange("minute", i.toString())}
                                                    >
                                                        {i.toString().padStart(2, "0")}
                                                    </Button>
                                                ))}
                                            </div>
                                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                                        </ScrollArea>
                                        {format12Hour && (
                                            <ScrollArea>
                                                <div className="flex sm:flex-col p-2">
                                                    {["AM", "PM"].map((ampm) => (
                                                        <Button
                                                            key={ampm}
                                                            size="icon"
                                                            type="button"
                                                            variant={
                                                                value &&
                                                                ((ampm === "AM" && value.getHours() < 12) ||
                                                                    (ampm === "PM" && value.getHours() >= 12))
                                                                    ? "default"
                                                                    : "ghost"
                                                            }
                                                            className="sm:w-full aspect-square"
                                                            onClick={() => handleTimeChange("ampm", ampm)}
                                                        >
                                                            {ampm}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        )}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
