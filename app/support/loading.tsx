import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b" />
        <div className="flex-1 p-6">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="md:col-span-2 h-[600px]" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
