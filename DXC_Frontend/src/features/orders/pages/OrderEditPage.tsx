import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OrderUpdateForm } from '../components/OrderUpdateForm'
import { useOrderDetail } from '../hooks/useOrders'

export const OrderEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: detailData, isLoading } = useOrderDetail(id as string)

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy đơn hàng</div>

  return (
    <FormPageLayout
      title="Quản lý Đơn hàng"
      description="Cập nhật trạng thái đơn đặt tour/vé"
      formTitle={`Cập nhật đơn hàng: ${detailData.data.bookingCode}`}
      breadcrumbItems={[
        { label: 'Quản lý đơn hàng', href: '/orders' },
        { label: 'Cập nhật', current: true }
      ]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-2">
            <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-2">
            <X className="w-4 h-4 text-blue-600" /> Hủy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => submitRef.current?.()} className="gap-2">
            <Check className="w-4 h-4 text-blue-600" /> Lưu
          </Button>
        </>
      }
    >
      <div className="mb-6 space-y-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-semibold mb-4 text-gray-900 border-b pb-2">Thông tin khách hàng</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium">{detailData.data.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">{detailData.data.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{detailData.data.email || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Ghi chú</p>
            <p className="font-medium bg-gray-50 p-2 rounded-md border mt-1 min-h-[40px] whitespace-pre-wrap text-sm">
              {detailData.data.note || <span className="text-gray-400 italic">Không có ghi chú</span>}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="font-semibold mb-4 text-gray-900 border-b pb-2">Thông tin dịch vụ</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Loại dịch vụ</p>
              <p className="font-medium">
                {detailData.data.tourId ? `Đặt Tour (ID: ${detailData.data.tourId})` : detailData.data.ticketId ? `Đặt Vé (ID: ${detailData.data.ticketId})` : 'Khác'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng</p>
              <p className="font-medium">{detailData.data.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày khởi hành dự kiến</p>
              <p className="font-medium">
                {detailData.data.departureDate ? new Date(detailData.data.departureDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detailData.data.totalAmount || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <OrderUpdateForm initialData={detailData.data} onSuccess={() => navigate('/orders')} onSave={(submit) => { submitRef.current = submit }} />
    </FormPageLayout>
  )
}
