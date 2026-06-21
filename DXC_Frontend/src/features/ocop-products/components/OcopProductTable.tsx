import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { OcopProductTableRow } from '../types'

interface OcopProductTableProps {
  items: OcopProductTableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  onDelete?: (id: string, name: string) => void
}

export const OcopProductTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: OcopProductTableProps) => {
  const navigate = useNavigate()

  const columns: Column<OcopProductTableRow>[] = [
    {
      key: 'name',
      label: 'Tên sản phẩm',
      width: '200px',
      sortable: true,
    },
    {
      key: 'categoryName',
      label: 'Danh mục',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'enterpriseName',
      label: 'Doanh nghiệp',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'referencePrice',
      label: 'Giá gốc',
      width: '120px',
      render: (value) => value ? `${value.toLocaleString('vi-VN')} ₫` : '-',
    },
    {
      key: 'promotionalPrice',
      label: 'Giá khuyến mãi',
      width: '120px',
      render: (value) => value ? `${value.toLocaleString('vi-VN')} ₫` : '-',
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '130px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-',
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: OcopProductTableRow) => {
        if (row.publicId) navigate(`/ocop-products/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: OcopProductTableRow) => {
        if (row.publicId) navigate(`/ocop-products/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: OcopProductTableRow) => {
        if (row.publicId && row.name) onDelete?.(row.publicId, row.name)
      },
    },
  ]

  const handleRowClick = (row: OcopProductTableRow) => {
    navigate(`/ocop-products/${row.publicId}`)
  }

  return (
    <DataTable<OcopProductTableRow>
      columns={columns}
      data={items}
      actions={actions}
      isLoading={isLoading}
      pagination={pagination}
      onRowClick={handleRowClick}
    />
  )
}
