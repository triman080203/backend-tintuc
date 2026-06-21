import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { HotlineCategoryTableRow } from '../types'

interface HotlineCategoryTableProps {
  items: HotlineCategoryTableRow[]
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

export const HotlineCategoryTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: HotlineCategoryTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: HotlineCategoryTableRow) => {
    navigate(`/hotline-categories/${row.publicId}`)
  }

  const columns: Column<HotlineCategoryTableRow>[] = [
    {
      key: 'thuTu',
      label: 'Thứ tự',
      width: '100px',
      sortable: true,
      render: (value) => (typeof value === 'number' ? value : '-'),
    },
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
      onClick: (row: HotlineCategoryTableRow) => {
        navigate(`/hotline-categories/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: HotlineCategoryTableRow) => {
        navigate(`/hotline-categories/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: HotlineCategoryTableRow) => {
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
        description: 'Hãy tạo danh mục Hotline đầu tiên của bạn',
      }}
    />
  )
}
