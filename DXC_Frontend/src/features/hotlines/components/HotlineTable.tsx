import { useNavigate } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { HotlineTableRow } from '../types'

interface HotlineTableProps {
  items: HotlineTableRow[]
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

export const HotlineTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: HotlineTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: HotlineTableRow) => {
    if (row.publicId) {
      navigate(`/hotlines/${row.publicId}`)
    }
  }

  const columns: Column<HotlineTableRow>[] = [
    {
      key: 'thuTu',
      label: 'Thứ tự',
      width: '100px',
      sortable: true,
      render: (value) => (typeof value === 'number' ? value : '-'),
    },
    {
      key: 'contactName',
      label: 'Tên liên hệ',
      width: '200px',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'categoryName',
      label: 'Danh mục',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '300px',
      render: (value) => value?.substring(0, 100) + (value && value.length > 100 ? '...' : '') || '-',
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-',
    },
  ]

  const actions = [
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: HotlineTableRow) => {
        if (row.publicId) {
          navigate(`/hotlines/${row.publicId}/edit`)
        }
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: HotlineTableRow) => {
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
        description: 'Hãy tạo hotline đầu tiên của bạn',
      }}
    />
  )
}

export default HotlineTable
