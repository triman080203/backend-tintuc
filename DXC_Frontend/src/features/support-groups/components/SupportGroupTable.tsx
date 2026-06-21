import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { SupportGroupTableRow } from '../types'

interface SupportGroupTableProps {
  items: SupportGroupTableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  onDelete?: (id: string) => void
}

export const SupportGroupTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: SupportGroupTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: SupportGroupTableRow) => {
    if (row.publicId) {
      navigate(`/support-groups/${row.publicId}`)
    }
  }

  const columns: Column<SupportGroupTableRow>[] = [
    {
      key: 'groupName',
      label: 'Tên nhóm',
      width: '240px',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'categoryName',
      label: 'Danh mục',
      width: '220px',
      render: (value) => value || '-',
    },
    {
      key: 'groupType',
      label: 'Loại nhóm',
      width: '180px',
      render: (value) => value || '-',
    },
    {
      key: 'groupLink',
      label: 'Liên kết',
      width: '240px',
      render: (value) => value || '-',
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '140px',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '140px',
      render: (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '-'),
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: SupportGroupTableRow) => {
        if (row.publicId) {
          navigate(`/support-groups/${row.publicId}`)
        }
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: SupportGroupTableRow) => {
        if (row.publicId) {
          navigate(`/support-groups/${row.publicId}/edit`)
        }
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: SupportGroupTableRow) => {
        if (row.publicId) {
          onDelete?.(row.publicId)
        }
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      actions={actions}
      pagination={pagination}
      rowKey="publicId"
      onRowClick={handleRowClick}
      emptyState={{
        icon: null,
        title: 'Không có dữ liệu',
        description: 'Hãy tạo nhóm hỗ trợ đầu tiên của bạn',
      }}
    />
  )
}
