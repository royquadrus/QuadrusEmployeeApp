import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryUsedSkeleton() {
    return (
        <div className="rounded-lg border p-3 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
        </div>
    );
}