import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { SupportGroupCategoryTableRow } from '../types'

interface SupportGroupCategoryTableProps {
  items: SupportGroupCategoryTableRow[]
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

export const SupportGroupCategoryTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: SupportGroupCategoryTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: SupportGroupCategoryTableRow) => {
    navigate(`/support-group-categories/${row.publicId}`)
  }

  const columns: Column<SupportGroupCategoryTableRow>[] = [
    {
      key: 'name',
      label: 'Tên danh mục',
      width: '250px',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '300px',
      render: (value) => (value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : '-'),
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '120px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '-'),
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: SupportGroupCategoryTableRow) => {
        navigate(`/support-group-categories/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: SupportGroupCategoryTableRow) => {
        navigate(`/support-group-categories/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: SupportGroupCategoryTableRow) => {
        onDelete?.(row.publicId)
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
        description: 'Hãy tạo danh mục nhóm hỗ trợ đầu tiên của bạn',
      }}
    />
  )
}