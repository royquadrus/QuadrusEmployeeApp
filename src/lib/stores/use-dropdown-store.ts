import { z } from "zod";
import { create } from "zustand";
import { DropdownPayPeriodSchema, DropdownProjectSchema, DropdownTimesheetTaskSchema, PayPeriod } from "../validation/dropdowns";
import { format } from "date-fns";

export const DropdownWOrkOrderSchema = z.object({
    work_order_id: z.coerce.string(),
    work_order_number: z.string(),
    pm_projects: z.object({
        project_name: z.string(),
    }),
});

export const DropdownInventoryItemSchema = z.object({
    item_sku: z.string(),
    item_name: z.string(),
})

export type DropdownWorkOrder = z.infer<typeof DropdownWOrkOrderSchema>;
export type DropdownInventoryItem = z.infer<typeof DropdownInventoryItemSchema>;

type DropdownOption = { id: string, label: string };

interface DropdownStore {
    workOrders: DropdownOption[];
    inventoryItems: DropdownOption[];
    projects: DropdownOption[];
    timesheetTasks: DropdownOption[];
    payPeriods: DropdownOption[];
    payPeriodRecords: PayPeriod[];
    isLoaded: boolean;
    fetchDropdownData: () => Promise<void>;
    forceReloadDropdownData: () => Promise<void>;
    clearDropdownState: () => void;
    addWorkOrder: (w: DropdownOption) => void;
    addInventoryItem: (i: DropdownOption) => void;
}

export const useDropdownStore = create<DropdownStore>((set, get) => ({
    workOrders: [],
    inventoryItems: [],
    projects: [],
    timesheetTasks: [],
    payPeriods: [],
    payPeriodRecords: [],
    isLoaded: false,
    fetchDropdownData: async () => {
        try {
            const [
                workOrderRes,
                inventoryItemRes,
                projectRes,
                timesheetTaskRes,
                payPeriodRes,
            ] = await Promise.all([
                fetch("/api/dropdown/work-orders"),
                fetch("/api/dropdown/inventory-items"),
                fetch("/api/dropdown/projects"),
                fetch("/api/dropdown/timesheet-tasks"),
                fetch("/api/dropdown/pay-periods"),
            ]);

            const workOrderData = DropdownWOrkOrderSchema.array().parse(await workOrderRes.json());
            const inventoryItemData = DropdownInventoryItemSchema.array().parse(await inventoryItemRes.json());
            const projectData = DropdownProjectSchema.array().parse(await projectRes.json());
            const timesheetTaskData = DropdownTimesheetTaskSchema.array().parse(await timesheetTaskRes.json());
            const payPeriodData = DropdownPayPeriodSchema.array().parse(await payPeriodRes.json());

            set ({
                //workOrders: workOrderData.map((c) => ({ id: c.work_order_id, label: c.work_order_number })),
                workOrders: workOrderData.map((w) => ({
                    id: w.work_order_id,
                    label: `${w.work_order_number} - ${w.pm_projects.project_name}`,
                })),
                inventoryItems: inventoryItemData.map((i) => ({ id: i.item_sku, label: i.item_name })),
                projects: projectData.map((p) => ({ id: p.project_id, label: p.project_name })),
                timesheetTasks: timesheetTaskData.map((t) => ({ id: t.timesheet_task_id, label: t.task_name })),
                payPeriods: payPeriodData.map((p) => ({
                    id: p.pay_period_id,
                    label: `${format(new Date(p.start_date), 'MM/dd')} - ${format(new Date(p.end_date), 'MM/dd')}     ${format(new Date(p.end_date), 'yyyy')}`,
                })),
                payPeriodRecords: payPeriodData,
                isLoaded: true,
            });
        } catch (error) {
            console.error("Failed to load dropdown data", error);
            set({ isLoaded: true });
        }
    },
    forceReloadDropdownData: async () => {
        set({ isLoaded: false });
        await get().fetchDropdownData();
    },
    clearDropdownState: () => {
        set({
            workOrders: [],
            inventoryItems: [],
            projects: [],
            timesheetTasks: [],
            payPeriods: [],
            payPeriodRecords: [],
            isLoaded: false,
        });
    },

    addWorkOrder: (w) => set((state) => ({ workOrders: [...state.workOrders, w] })),
    addInventoryItem: (i) => set((state) => ({ inventoryItems: [...state.inventoryItems, i] })),
}));