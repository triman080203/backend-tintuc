import { useNavigate } from 'react-router-dom'
import { Eye, Edit } from 'lucide-react'
import { DataTable } from '@/shared/components/DataTable'
import type { Column } from '@/shared/components/DataTable'
import { Checkbox } from '@/components/ui/checkbox'
import type { TotalUserTableRow } from '../types'

interface TotalUserTableProps {
  items: TotalUserTableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

const toChecked = (value?: string | null): boolean => {
  const v = (value || '').trim().toLowerCase()
  if (!v) return false
  return v === 'true' || v === '1' || v === 'yes'
}

export const TotalUserTable = ({ items, isLoading, pagination }: TotalUserTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: TotalUserTableRow) => {
    navigate(`/total-users/${row.id}`)
  }

  const columns: Column<TotalUserTableRow>[] = [
    { key: 'userId', label: 'UserId', width: '100px', sortable: true },
    { key: 'username', label: 'Username', width: '220px', sortable: true },
    {
      key: 'avatar',
      label: 'Avatar',
      width: '160px',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full overflow-hidden border size-10">
              <img
                src={value ? String(value) : ''}
                alt={`Avatar ${row.username}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'phanQuyen',
      label: 'Phân quyền',
      width: '120px',
      render: (value) => (
        <div className="flex items-center">
          <Checkbox checked={toChecked(value as string | null)} disabled aria-label="Phân quyền" />
        </div>
      )
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      width: '150px',
      render: (value) => (
        <div className="flex items-center">
          {value ? value : '-'}
        </div>
      )
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: TotalUserTableRow) => navigate(`/total-users/${row.id}`),
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: TotalUserTableRow) => navigate(`/total-users/${row.id}/edit`),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      actions={actions}
      pagination={pagination}
      rowKey="id"
      onRowClick={handleRowClick}
      emptyState={{ title: 'Không có dữ liệu', description: 'Hãy thêm người dùng đầu tiên' }}
    />
  )
}
