import { ModuleNav } from "@/components/navigation/module-nav";
import { CircleGauge, CircleMinus, CirclePlus, Grid2X2Plus, Grid2x2X } from "lucide-react";

const inventoryNavItems = [
    {
        name: "Home",
        href: "/inventory/dashboard",
        icon: <CircleGauge className="h-4 w-4" />,
    },
    {
        name: "Orders",
        href: "/inventory/orders",
        icon: <Grid2X2Plus className="h-4 w-4" />,
    },
    {
        name: "Returns",
        href: "/inventory/returns",
        icon: <Grid2x2X className="h-4 w-4" />,
    },
    {
        name: "Used",
        href: "/inventory/used",
        icon: <CirclePlus className="h-4 w-4" />,
    },
    {
        name: "Remaining",
        href: "/inventory/remaining",
        icon: <CircleMinus className="h-4 w-4" />
    },
];

export default function InventoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <ModuleNav items={inventoryNavItems} basePath="/inventory" />
            <div className="p-4">{children}</div>
        </div>
    );
}