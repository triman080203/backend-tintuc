import { DataTable } from '@/shared/components'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/shared/utils/date'
import type { OrderTableRow } from '../types'

interface OrderTableProps {
  items: OrderTableRow[]
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

export const OrderTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: OrderTableProps) => {
  const navigate = useNavigate()

  const columns = [
    {
      key: 'bookingCode',
      label: 'Mã đơn',
      render: (_: any, item: OrderTableRow) => (
        <span className="font-medium text-blue-600">{item.bookingCode}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Khách hàng',
      render: (_: any, item: OrderTableRow) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.customerName}</span>
          <span className="text-xs text-gray-500">{item.phoneNumber}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Loại',
      render: (_: any, item: OrderTableRow) => (
        <span>{item.tourId ? 'Tour' : item.ticketId ? 'Vé' : 'Khác'}</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Tổng tiền',
      render: (_: any, item: OrderTableRow) => (
        <span className="font-medium text-green-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (_: any, item: OrderTableRow) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
            item.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Thanh toán',
      render: (_: any, item: OrderTableRow) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}
        >
          {item.paymentStatus}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày đặt',
      render: (_: any, item: OrderTableRow) => (
        <span className="text-gray-500">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: any, item: OrderTableRow) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/orders/${item.publicId}`) }}
            className="h-8 w-8 p-0"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/orders/${item.publicId}/edit`) }}
            className="h-8 w-8 p-0"
            title="Cập nhật trạng thái"
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
      emptyState={{ title: 'Chưa có đơn đặt nào' }}
      onRowClick={(item) => navigate(`/orders/${item.publicId}`)}
    />
  )
}
