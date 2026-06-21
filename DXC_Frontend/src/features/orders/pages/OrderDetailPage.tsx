import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, QrCode, Copy, CheckCircle2, Loader2 } from 'lucide-react'
import { useOrderDetail, orderKeys } from '../hooks/useOrders'
import { getZaloMiniAppOrdersMobile } from '@/api/endpoints/zalo-mini-app-orders-mobile'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'


export const OrderDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: detailData, isLoading } = useOrderDetail(id as string)
  const queryClient = useQueryClient()

  // QR dialog state
  const [qrOpen, setQrOpen] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pollStatus, setPollStatus] = useState<'waiting' | 'paid'>('waiting')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Dừng polling khi dialog đóng
  useEffect(() => {
    if (!qrOpen && pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
      setPollStatus('waiting')
      setQrUrl(null)
    }
  }, [qrOpen])

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy đơn hàng</div>

  const order = detailData.data

  // --- Polling: kiểm tra trạng thái đơn hàng mỗi 3 giây ---
  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const api = getZaloMiniAppOrdersMobile()
        const res = await api.getApiZaloMiniAppMobileOrdersPublicId(id as string)
        if (res?.data?.paymentStatus === 'Paid') {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setPollStatus('paid')
          queryClient.invalidateQueries({ queryKey: orderKeys.detail(id as string) })
          queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
        }
      } catch {
        // ignore polling errors
      }
    }, 3000)
  }

  const handleCopyUrl = () => {
    if (!qrUrl) return
    navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qrImageUrl = qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(qrUrl)}`
    : null

  return (
    <>
      {/* QR Payment Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              Quét mã để thanh toán
            </DialogTitle>
            <DialogDescription>
              Dùng camera điện thoại quét mã QR bên dưới để xác nhận thanh toán.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            {pollStatus === 'paid' ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-green-700">Thanh toán thành công!</p>
                <p className="text-sm text-gray-500 text-center">
                  Đơn hàng <strong>{order.bookingCode}</strong> đã được cập nhật trạng thái Đã thanh toán.
                </p>
                <Button onClick={() => setQrOpen(false)} className="mt-2">
                  Đóng
                </Button>
              </div>
            ) : (
              <>
                {/* QR Image */}
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-2 bg-white">
                  {qrImageUrl && (
                    <img
                      src={qrImageUrl}
                      alt="QR thanh toán"
                      className="w-[220px] h-[220px]"
                    />
                  )}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="w-full bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mã đơn:</span>
                    <span className="font-semibold">{order.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số tiền:</span>
                    <span className="font-bold text-red-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Polling indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang chờ xác nhận thanh toán...
                </div>

                {/* Copy URL */}
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Đã sao chép!' : 'Sao chép link'}
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FormPageLayout
        title="Chi tiết đơn hàng"
        description="Xem chi tiết thông tin đơn đặt tour/vé"
        formTitle={`Mã đơn: ${order.bookingCode || 'N/A'}`}
        breadcrumbItems={[
          { label: 'Quản lý đơn hàng', href: '/orders' },
          { label: 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="gap-2">
              <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
            </Button>
            <ActionBarDivider />
            <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${id}/edit`)} className="gap-2">
              <Edit className="w-4 h-4 text-amber-600" /> Cập nhật trạng thái
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{order.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ghi chú</p>
              <p className="font-medium bg-gray-50 p-3 rounded-md border mt-1 min-h-[60px] whitespace-pre-wrap">
                {order.note || <span className="text-gray-400 italic">Không có ghi chú</span>}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin dịch vụ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loại dịch vụ</p>
                <p className="font-medium">
                  {order.tourId ? `Đặt Tour (ID: ${order.tourId})` : order.ticketId ? `Đặt Vé (ID: ${order.ticketId})` : 'Khác'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số lượng</p>
                <p className="font-medium">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày khởi hành dự kiến</p>
                <p className="font-medium">
                  {order.departureDate ? new Date(order.departureDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-bold text-red-600 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Trạng thái</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Trạng thái xử lý</p>
                <p className="font-medium">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full inline-block mt-1 ${
                    order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <p className="font-medium">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full inline-block mt-1 ${
                    order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.paymentStatus || 'Unpaid'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="font-medium">{order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </FormPageLayout>
    </>
  )
}
