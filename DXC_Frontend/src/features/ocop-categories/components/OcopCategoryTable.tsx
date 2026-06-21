import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { OcopCategoryTableRow } from '../types'

interface OcopCategoryTableProps {
  items: OcopCategoryTableRow[]
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

export const OcopCategoryTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: OcopCategoryTableProps) => {
  const navigate = useNavigate()

  const columns: Column<OcopCategoryTableRow>[] = [
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
      render: (value) => value?.substring(0, 100) + (value && value.length > 100 ? '...' : '') || '-',
    },
    {
      key: 'displayOrder',
      label: 'Thứ tự',
      width: '100px',
      render: (value) => value || '-',
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
      label: 'Xem',
      icon: Eye,
      onClick: (row: OcopCategoryTableRow) => {
        if (row.publicId) navigate(`/ocop-categories/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: OcopCategoryTableRow) => {
        if (row.publicId) navigate(`/ocop-categories/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: OcopCategoryTableRow) => {
        if (row.publicId) onDelete?.(row.publicId)
      },
    },
  ]

  const handleRowClick = (row: OcopCategoryTableRow) => {
    if (row.publicId) {
      navigate(`/ocop-categories/${row.publicId}`)
    }
  }

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
        description: 'Hãy tạo danh mục OCOP đầu tiên của bạn',
      }}
    />
  )
}

export default OcopCategoryTable
