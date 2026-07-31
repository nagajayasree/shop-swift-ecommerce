import { Skeleton } from "@/features/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}
