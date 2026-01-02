import React from "react"

interface ToolbarLayoutProps {
  filters: React.ReactNode;
  actions?: React.ReactNode;
}

export function ToolbarLayout({ filters, actions }: ToolbarLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {filters}
        </div>
        {actions && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
