import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ActiveEntry, PayPeriod, Timesheet } from "../validation/btimeclock";

interface TimeclockSessionState {
   // Core session context
   currentPayPeriod: PayPeriod | null;
   selectedPayPeriod: PayPeriod | null;

   currentTimesheet: Timesheet | null;
   selectedTimesheet: number | null;
   selectedTimesheetStatus: string | null;

   activeEntry: ActiveEntry | null;

   // UI state
   selectedDate: string;
   selectedEntryId: string | null;

   // Actions
   setCurrentPayPeriod: (p: PayPeriod | null) => void;
   setSelectedPayPeriod: (p: PayPeriod | null) => void;

   setCurrentTimesheet: (t: Timesheet | null) => void;
   setSelectedTimesheet: (id: number | null) => void;
   setSelectedTimesheetStatus: (status: string | null) => void;

   setActiveEntry: (entry: ActiveEntry | null) => void;

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
            selectedTimesheetStatus: null,

            activeEntry: null,

            selectedDate: new Date().toISOString().split("T")[0],
            selectedEntryId: null,

            setCurrentPayPeriod: (p) => set({ currentPayPeriod: p }),
            setSelectedPayPeriod: (p) => set({ selectedPayPeriod: p }),

            setCurrentTimesheet: (t) => set({ currentTimesheet: t }),
            setSelectedTimesheet: (id) => set({ selectedTimesheet: id }),
            setSelectedTimesheetStatus: (status) => set({ selectedTimesheetStatus: status }),

            setActiveEntry: (entry) => set({ activeEntry: entry }),

            setSelectedDate: (date) => set({ selectedDate: date }),
            setSelectedEntryId: (id) => set({ selectedEntryId: id }),

            clearTimeclockSession: () =>
                set({
                    currentPayPeriod: null,
                    selectedPayPeriod: null,
                    currentTimesheet: null,
                    selectedTimesheet: null,
                    selectedTimesheetStatus: null,
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
                selectedTimesheetStatus: state.selectedTimesheetStatus,
                activeEntry: state.activeEntry,
                selectedEntryId: state.selectedEntryId,
                selectedDate: state.selectedDate,   
            }),
        }
    )
);