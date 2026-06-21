import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2, MapPin, Phone, DollarSign } from 'lucide-react'
import { DataTable, type Column, type TableAction } from '@/shared/components'
import type { HomestayTableRow } from '../types'

interface HomestayTableProps {
  items: HomestayTableRow[]
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

export const HomestayTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: HomestayTableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<HomestayTableRow>[] = [
    {
      key: 'thuTu',
      label: 'Thứ tự',
      width: '100px',
      sortable: true,
      render: (value) => (typeof value === 'number' ? value : '-'),
    },
    {
      key: 'name',
      label: 'Tên homestay',
      width: '200px',
      sortable: true,
      render: (value) => value || '-',
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      width: '250px',
      render: (value) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-500" />
          <span className="truncate">{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      width: '130px',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-gray-500" />
          <span>{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'averagePrice',
      label: 'Giá trung bình',
      width: '130px',
      render: (value, row) => {
        if (!value) return '-'
        const currency = row.averagePriceCurrency || 'VND'
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-green-600 font-medium">
              {value.toLocaleString()} {currency}
            </span>
          </div>
        )
      },
    },
    {
      key: 'imageCount',
      label: 'Hình ảnh',
      width: '80px',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || 0} ảnh
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '120px',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ]

  // Define actions
  const actions: TableAction[] = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: HomestayTableRow) => {
        navigate(`/homestays/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: HomestayTableRow) => {
        navigate(`/homestays/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row: HomestayTableRow) => {
        onDelete?.(row.publicId)
      },
    },
  ]

  // Handle row click to view details
  const handleRowClick = (row: HomestayTableRow) => {
    navigate(`/homestays/${row.publicId}`)
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
        title: 'Không có homestay nào',
        description: 'Hãy tạo homestay đầu tiên của bạn',
      }}
    />
  )
}

export default HomestayTable
