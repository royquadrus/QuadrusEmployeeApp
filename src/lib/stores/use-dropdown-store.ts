import { z } from "zod";
import { create } from "zustand";
import { DropdownProjectSchema, DropdownTimesheetTaskSchema } from "../validation/dropdowns";

export const DropdownWOrkOrderSchema = z.object({
    work_order_id: z.coerce.string(),
    work_order_number: z.string(),
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
    isLoaded: false,
    fetchDropdownData: async () => {
        try {
            const [
                workOrderRes,
                inventoryItemRes,
                projectRes,
                timesheetTaskRes,
            ] = await Promise.all([
                fetch("/api/dropdown/work-orders"),
                fetch("/api/dropdown/inventory-items"),
                fetch("/api/dropdown/projects"),
                fetch("/api/dropdown/timesheet-tasks"),
            ]);

            const workOrderData = DropdownWOrkOrderSchema.array().parse(await workOrderRes.json());
            const inventoryItemData = DropdownInventoryItemSchema.array().parse(await inventoryItemRes.json());
            const projectData = DropdownProjectSchema.array().parse(await projectRes.json());
            const timesheetTaskData = DropdownTimesheetTaskSchema.array().parse(await timesheetTaskRes.json());

            set ({
                workOrders: workOrderData.map((c) => ({ id: c.work_order_id, label: c.work_order_number })),
                inventoryItems: inventoryItemData.map((i) => ({ id: i.item_sku, label: i.item_name })),
                projects: projectData.map((p) => ({ id: p.project_id, label: p.project_name })),
                timesheetTasks: timesheetTaskData.map((t) => ({ id: t.timesheet_task_id, label: t.task_name })),
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
            isLoaded: false,
        });
    },

    addWorkOrder: (w) => set((state) => ({ workOrders: [...state.workOrders, w] })),
    addInventoryItem: (i) => set((state) => ({ inventoryItems: [...state.inventoryItems, i] })),
}));