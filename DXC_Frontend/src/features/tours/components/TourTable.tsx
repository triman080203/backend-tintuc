import { DataTable } from '@/shared/components'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/shared/utils/date'
import type { TourTableRow } from '../types'

interface TourTableProps {
  items: TourTableRow[]
  isLoading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  onDelete: (id: string) => void
}

export const TourTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: TourTableProps) => {
  const navigate = useNavigate()

  const columns = [
    {
      key: 'name',
      label: 'Tên tour',
      render: (_: any, item: TourTableRow) => (
        <span className="font-medium text-gray-900">
          {item.name}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      render: (_: any, item: TourTableRow) => (
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
      ),
    },
    {
      key: 'duration',
      label: 'Thời gian',
      render: (_: any, item: TourTableRow) => (
        <span>{item.durationDays} ngày {item.durationNights} đêm</span>
      ),
    },
    {
      key: 'participants',
      label: 'Tối đa',
      render: (_: any, item: TourTableRow) => (
        <span>{item.maxParticipants} người</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (_: any, item: TourTableRow) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (_: any, item: TourTableRow) => (
        <span className="text-gray-500">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: any, item: TourTableRow) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/tours/${item.publicId}`) }}
            className="h-8 w-8 p-0"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/tours/${item.publicId}/edit`) }}
            className="h-8 w-8 p-0"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4 text-amber-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(item.publicId) }}
            className="h-8 w-8 p-0"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      pagination={pagination}
      emptyState={{ title: 'Chưa có tour nào' }}
      onRowClick={(item) => navigate(`/tours/${item.publicId}`)}
    />
  )
}
