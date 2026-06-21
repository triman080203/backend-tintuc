import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from './Pagination'
import { type LucideIcon } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  label: string
  width?: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export interface TableAction {
  label: string
  icon?: LucideIcon
  onClick: (row: any) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  show?: (row: any) => boolean
}

export interface PaginationConfig {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export interface EmptyState {
  icon?: React.ReactNode
  title?: string
  description?: string
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  actions?: TableAction[]
  pagination?: PaginationConfig
  emptyState?: EmptyState
  rowKey?: keyof T
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  pagination,
  emptyState,
  rowKey = 'id' as keyof T,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          {emptyState?.icon && <div className="flex justify-center">{emptyState.icon}</div>}
          <p className="font-medium text-foreground">
            {emptyState?.title || 'Không có dữ liệu'}
          </p>
          {emptyState?.description && (
            <p className="text-sm text-muted-foreground">{emptyState.description}</p>
          )}
        </div>
      </div>
    )
  }

  // Create index column with pagination support
  const indexColumn: Column<T> = {
    key: '__index' as keyof T,
    label: '#',
    width: '50px',
    render: (_, __, index) => {
      if (pagination) {
        return ((pagination.current - 1) * pagination.pageSize) + index + 1
      }
      return index + 1
    }
  }

  // Prepend index column to user columns
  const allColumns = [indexColumn, ...columns]

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table className={className}>
          <TableHeader className="bg-blue-600">
            <TableRow>
              {allColumns.map((column) => (
                <TableHead 
                  key={String(column.key)} 
                  style={{ width: column.width }}
                  className="text-white font-bold"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                {allColumns.map((column) => {
                  const value = row[column.key as keyof T]
                  return (
                    <TableCell key={String(column.key)}>
                      {column.render ? column.render(value, row, index) : String(value || '-')}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onChange={pagination.onChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  )
}
