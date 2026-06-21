import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { HotelTableRow } from '../types'

interface HotelTableProps {
  items: HotelTableRow[]
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

export const HotelTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: HotelTableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<HotelTableRow>[] = [
    {
      key: 'thuTu',
      label: 'Thứ tự',
      width: '100px',
      sortable: true,
      render: (value) => (typeof value === 'number' ? value : '-'),
    },
    {
      key: 'name',
      label: 'Tên khách sạn',
      width: '200px',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      width: '200px',
      render: (value) => value || '-',
    },
    
    {
      key: 'phoneNumber',
      label: 'Điện thoại',
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

  // Define actions
  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: HotelTableRow) => {
        if (row.publicId) navigate(`/hotels/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: HotelTableRow) => {
        if (row.publicId) navigate(`/hotels/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: HotelTableRow) => {
        if (row.publicId) onDelete?.(row.publicId)
      },
    },
  ]

  // Handle row click to view details
  const handleRowClick = (row: HotelTableRow) => {
    if (row.publicId) {
      navigate(`/hotels/${row.publicId}`)
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
        description: 'Hãy tạo khách sạn đầu tiên của bạn',
      }}
    />
  )
}
