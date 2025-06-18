import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BaseTimesheet, BaseTimesheetEntry, PayPeriod } from "../validation/timeclock";

interface TimeclockSessionState {
   // Core session context
   currentPayPeriod: PayPeriod | null;
   selectedPayPeriod: PayPeriod | null;

   currentTimesheet: BaseTimesheet | null;
   selectedTimesheet: BaseTimesheet | null;

   activeEntry: BaseTimesheetEntry | null;

   // UI state
   selectedDate: string;
   selectedEntryId: string | null;

   // Actions
   setCurrentPayPeriod: (p: PayPeriod | null) => void;
   setSelectedPayPeriod: (p: PayPeriod | null) => void;

   setCurrentTimesheet: (t: BaseTimesheet | null) => void;
   setSelectedTimesheet: (t: BaseTimesheet | null) => void;

   setActiveEntry: (entry: BaseTimesheetEntry | null) => void;

   setSelectedDate: (date: string) => void;
   setSelectedEntryId: (id: string | null) => void;

   clearTimeclockSession: () => void;
}

export const useTimeclockSessionStore = create<TimeclockSessionState>()(
    persist(
        (set) => ({
            currentPayPeriod: null,
            selectedPayPeriod: null,

            currentTimesheet: null,
            selectedTimesheet: null,

            activeEntry: null,

            selectedDate: new Date().toISOString().split("T")[0],
            selectedEntryId: null,

            setCurrentPayPeriod: (p) => set({ currentPayPeriod: p }),
            setSelectedPayPeriod: (p) => set({ selectedPayPeriod: p }),

            setCurrentTimesheet: (t) => set({ currentTimesheet: t }),
            setSelectedTimesheet: (t) => set({ selectedTimesheet: t }),

            setActiveEntry: (entry) => set({ activeEntry: entry }),

            setSelectedDate: (date) => set({ selectedDate: date }),
            setSelectedEntryId: (id) => set({ selectedEntryId: id }),

            clearTimeclockSession: () =>
                set({
                    currentPayPeriod: null,
                    selectedPayPeriod: null,
                    currentTimesheet: null,
                    selectedTimesheet: null,
                    activeEntry: null,
                    selectedDate: new Date().toISOString().split("T")[0],
                    selectedEntryId: null,
                }),
        }),
        {
            name: "timeclock-session-storage",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                currentPayPeriod: state.currentPayPeriod,
                selectedPayPeriod: state.selectedPayPeriod,
                currentTimesheet: state.currentTimesheet,
                selectedTimesheet: state.selectedTimesheet,
                activeEntry: state.activeEntry,
                selectedEntryId: state.selectedEntryId,
                selectedDate: state.selectedDate,   
            }),
        }
    )
);