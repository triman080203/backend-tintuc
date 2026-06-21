import * as React from "react"

import { cn } from "@/lib/utils"

function EnhancedTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function EnhancedTableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b", className)}
      {...props}
    />
  )
}

function EnhancedTableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function EnhancedTableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableHeaderRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-header-row"
      className={cn(
        "border border-transparent hover:backdrop-opacity transition-colors",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableHeaderCell({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-header-cell"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap border-r font-bold",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function EnhancedTableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

// Export all components
export {
  EnhancedTable as Table,
  EnhancedTableHeader as TableHeader,
  EnhancedTableBody as TableBody,
  EnhancedTableFooter as TableFooter,
  EnhancedTableRow as TableRow,
  EnhancedTableHead as TableHead,
  EnhancedTableCell as TableCell,
  EnhancedTableCaption as TableCaption,
  EnhancedTableHeaderRow as TableHeaderRow,
  EnhancedTableHeaderCell as TableHeaderCell,
}
