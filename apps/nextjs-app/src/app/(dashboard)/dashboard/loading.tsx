import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-20" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-10 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[200px] w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
               {Array.from({ length: 3 }).map((_, i) => (
                   <div key={i} className="flex items-center">
                       <Skeleton className="h-9 w-9 rounded-full" />
                       <div className="ml-4 space-y-1">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-3 w-24" />
                       </div>
                       <Skeleton className="ml-auto h-4 w-12" />
                   </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
