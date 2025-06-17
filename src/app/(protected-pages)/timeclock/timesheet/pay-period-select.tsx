"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { useTimeclockSessionStore } from "@/lib/stores/use-timeclock-session-store";

interface PayPeriodSelectProps {
    className?: string;
}

export function PayPeriodSelect({ className }: PayPeriodSelectProps) {
    const {
        selectedPayPeriod,
        currentPayPeriod,
        setSelectedPayPeriod,
    } = useTimeclockSessionStore();

    const { payPeriods, payPeriodRecords, isLoaded } = useDropdownStore();

    const handlePayPeriodChange = (value: string) => {
        const payPeriod = payPeriodRecords.find(pp => pp.pay_period_id === value);
        if (payPeriod) {
            setSelectedPayPeriod(payPeriod);
        }
    };

    const getCurrentValue = () => {
        return selectedPayPeriod?.pay_period_id || currentPayPeriod?.pay_period_id || '';
    };

    return (
        <div className={className}>
            <Label htmlFor="pay-period-select" className="block text-sm font-medium mb-2">
                Pay Period
            </Label>
            <Select
                value={getCurrentValue()}
                onValueChange={handlePayPeriodChange}
                disabled={!isLoaded || payPeriods.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={
                            isLoaded
                                ? "Loading pay periods..."
                                : payPeriods.length === 0
                                    ? "No pay periods available"
                                    : "Select pay period"
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {payPeriods.map((payPeriod) => (
                        <SelectItem
                            key={payPeriod.id}
                            value={payPeriod.id}
                        >
                            {payPeriod.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}