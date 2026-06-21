import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { BannerTableRow } from '../types'

interface BannerTableProps {
  items: BannerTableRow[]
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

export const BannerTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: BannerTableProps) => {
  const navigate = useNavigate()

  const columns: Column<BannerTableRow>[] = [
    {
      key: 'title',
      label: 'Tiêu đề',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'position',
      label: 'Vị trí',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'bannerType',
      label: 'Loại',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '130px',
      render: (value) => (
        <span className={value ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {value ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      ),
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
      onClick: (row: BannerTableRow) => {
        if (row.publicId) navigate(`/banners/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: BannerTableRow) => {
        if (row.publicId) navigate(`/banners/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: BannerTableRow) => {
        if (row.publicId) onDelete?.(row.publicId)
      },
    },
  ]

  const handleRowClick = (row: BannerTableRow) => {
    if (row.publicId) {
      navigate(`/banners/${row.publicId}`)
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
        description: 'Hãy tạo banner đầu tiên của bạn',
      }}
    />
  )
}
