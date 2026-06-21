import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { OrderTable } from '../components/OrderTable'
import { useOrders, useDeleteOrder } from '../hooks/useOrders'
import type { OrderTableRow } from '../types'

export const OrderListPage = () => {
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  
  const { data, isLoading } = useOrders({
    ...getPaginationParams(),
  })
  
  const deleteQuery = useDeleteOrder()

  const handleDelete = (publicId: string) => {
    if (confirm('Bạn có chắc muốn xóa đơn hàng này? Thao tác này không thể hoàn tác!')) {
      deleteQuery.mutate({ publicId })
    }
  }

  const tableData: OrderTableRow[] = (data?.data || []).map(item => ({
    publicId: item.publicId || '',
    bookingCode: item.bookingCode || null,
    customerName: item.customerName || null,
    phoneNumber: item.phoneNumber || null,
    tourId: item.tourId || null,
    ticketId: item.ticketId || null,
    totalAmount: item.totalAmount || 0,
    status: item.status || 'Pending',
    paymentStatus: item.paymentStatus || 'Unpaid',
    createdAt: item.createdAt || '',
  }))

  return (
    <ListPageLayout
      title="Quản lý Đơn hàng"
      description="Quản lý tất cả yêu cầu đặt tour/vé trong hệ thống"
      breadcrumbItems={[{ label: 'Quản lý đơn hàng', current: true }]}
      actionBarContent={<></>}
    >
      <OrderTable
        items={tableData}
        isLoading={isLoading}
        pagination={{
          current: page,
          total: data?.total || 0,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        onDelete={handleDelete}
      />
    </ListPageLayout>
  )
}
