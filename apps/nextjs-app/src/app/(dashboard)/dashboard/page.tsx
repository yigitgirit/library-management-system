"use client"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/common/components/ui/card"
import { 
  Book, 
  Users, 
  Library, 
  AlertCircle, 
  DollarSign,
  BookX, 
  BookOpenCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wrench,
  LucideIcon
} from "lucide-react"
import { ROLES } from "@/lib/constants"
import { DashboardControllerService } from "@/lib/api"
import { Skeleton } from "@/features/common/components/ui/skeleton"
import { Progress } from "@/features/common/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/common/components/ui/tooltip"
import { Button } from "@/features/common/components/ui/button"
import Link from "next/link"
import {useQuery} from "@tanstack/react-query";

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.roles?.includes(ROLES.ADMIN)

  const { data: statsData, isLoading } = useQuery({
          queryKey: ['dashboard-overview'],
          queryFn: DashboardControllerService.getOverview
      })

  const stats = statsData?.data

  // Calculate percentages for progress bars
  const availabilityRate = stats?.totalCopies && stats?.totalCopies > 0 
    ? Math.round(((stats.availableCopies || 0) / stats.totalCopies) * 100) 
    : 0

  const activeUserRate = stats?.totalUsers && stats?.totalUsers > 0
    ? Math.round(((stats.activeUsers || 0) / stats.totalUsers) * 100)
    : 0

  return (
    <div className="flex flex-1 flex-col gap-8">
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || 'User'}. Here&#39;s what&#39;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
             <Button asChild>
                <Link href="/books/new">Add New Book</Link>
             </Button>
          )}
        </div>
      </div>

      {/* 2. Key Metrics (KPI Cards) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total Books" 
          value={stats?.totalBooks} 
          icon={Book} 
          loading={isLoading}
          subtext="Unique titles in library"
        />
        <KpiCard 
          title="Active Loans" 
          value={stats?.activeLoans} 
          icon={Library} 
          loading={isLoading}
          subtext="Currently borrowed"
          trend="up" // Mock trend
        />
        <KpiCard 
          title="Overdue Loans" 
          value={stats?.overdueLoans} 
          icon={AlertCircle} 
          loading={isLoading}
          subtext="Requires immediate attention"
          variant="destructive"
        />
        {isAdmin ? (
            <KpiCard 
              title="Total Users" 
              value={stats?.totalUsers} 
              icon={Users} 
              loading={isLoading}
              subtext="Registered members"
            />
        ) : (
            <KpiCard 
              title="My Fines" 
              value={stats?.unpaidFinesAmount} 
              icon={DollarSign} 
              loading={isLoading}
              prefix="$"
              subtext="Pending payment"
              variant="destructive"
            />
        )}
      </div>

      {/* 3. Detailed Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Inventory Status (Col Span 4) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Real-time status of all physical copies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Availability Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <BookOpenCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Availability Rate</span>
                    </div>
                    <span className="text-muted-foreground">{availabilityRate}% ({stats?.availableCopies || 0}/{stats?.totalCopies || 0})</span>
                </div>
                <Progress value={availabilityRate} className="h-2" />
            </div>

            {/* Stats Grid inside Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <StatItem 
                    label="Available" 
                    value={stats?.availableCopies} 
                    icon={BookOpenCheck} 
                    color="text-green-600" 
                    loading={isLoading}
                    tooltip="Copies ready to be borrowed"
                />
                <StatItem 
                    label="On Loan" 
                    value={stats?.loanedCopies} 
                    icon={Library} 
                    color="text-blue-500" 
                    loading={isLoading} 
                    tooltip="Copies currently borrowed by users"
                />
                <StatItem 
                    label="Maintenance" 
                    value={stats?.maintenanceCopies}
                    icon={Wrench} 
                    color="text-orange-600" 
                    loading={isLoading} 
                    tooltip="Copies under repair or maintenance"
                />
                <StatItem 
                    label="Lost" 
                    value={stats?.lostBooks} 
                    icon={BookX} 
                    color="text-destructive" 
                    loading={isLoading}
                    tooltip="Copies reported as lost"
                />
            </div>
          </CardContent>
        </Card>

        {/* Financials & Activity (Col Span 3) */}
        <div className="col-span-3 space-y-4">
            {/* Financial Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Financial Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Unpaid Fines</p>
                            <p className="text-xs text-muted-foreground">Total outstanding</p>
                        </div>
                        <div className="text-xl font-bold text-destructive">
                            ${stats?.unpaidFinesAmount?.toLocaleString() ?? 0}
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Collected</p>
                                <p className="text-xs text-muted-foreground">This month</p>
                            </div>
                            <div className="text-xl font-bold text-green-600">
                                ${stats?.collectedFinesThisMonth?.toLocaleString() ?? 0}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Activity Card (Admin) */}
            {isAdmin && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4" /> User Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Active Users</span>
                                <span className="font-medium">{activeUserRate}%</span>
                            </div>
                            <Progress value={activeUserRate} className="h-2" />
                            <p className="text-xs text-muted-foreground pt-1">
                                {stats?.activeUsers} out of {stats?.totalUsers} users have active loans.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  )
}

// --- Sub-Components ---

interface KpiCardProps {
    title: string;
    value?: number;
    icon: LucideIcon;
    loading: boolean;
    subtext?: string;
    prefix?: string;
    variant?: "default" | "destructive";
    trend?: "up" | "down";
}

function KpiCard({ title, value, icon: Icon, loading, subtext, prefix, variant = "default", trend }: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${variant === "destructive" ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-1">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                ) : (
                    <>
                        <div className={`text-2xl font-bold ${variant === "destructive" ? "text-destructive" : ""}`}>
                            {prefix}{value?.toLocaleString() ?? 0}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {subtext}
                            {trend === "up" && <ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />}
                            {trend === "down" && <ArrowDownRight className="ml-1 h-3 w-3 text-red-500" />}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

interface StatItemProps {
    label: string;
    value?: number;
    icon: LucideIcon;
    color: string;
    loading: boolean;
    tooltip?: string;
}

function StatItem({ label, value, icon: Icon, color, loading, tooltip }: StatItemProps) {
    const content = (
        <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors">
            {loading ? (
                <Skeleton className="h-8 w-8 rounded-full mb-2" />
            ) : (
                <div className={`p-2 rounded-full bg-background shadow-sm mb-2 ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
            )}
            <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-6 w-12" /> : (value?.toLocaleString() ?? 0)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
        </div>
    )

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return content
}
