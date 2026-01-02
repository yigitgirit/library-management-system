import React from "react"

interface DashboardPageHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardPageHeader({
  heading,
  text,
  children,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
