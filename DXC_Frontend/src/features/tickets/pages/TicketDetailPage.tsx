import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit } from 'lucide-react'
import { useTicketDetail } from '../hooks/useTickets'

export const TicketDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: detailData, isLoading } = useTicketDetail(id as string)

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy Ticket</div>

  const Ticket = detailData.data

  return (
    <FormPageLayout
      title="Chi tiết Vé"
      description="Xem chi tiết thông tin Vé"
      formTitle={Ticket.name || 'Chi tiết Vé'}
      breadcrumbItems={[
        { label: 'Quản lý Vé', href: '/tickets' },
        { label: 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tickets')} className="gap-2">
            <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate(`/tickets/${id}/edit`)} className="gap-2">
            <Edit className="w-4 h-4 text-amber-600" /> Chỉnh sửa
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin chung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tên vé</p>
              <p className="font-medium">{Ticket.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className="font-medium">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${Ticket.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {Ticket.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá Người lớn</p>
              <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Ticket.price || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá Trẻ em</p>
              <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Ticket.childPrice || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thứ tự hiển thị</p>
              <p className="font-medium">{Ticket.thuTu}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium">{Ticket.createdAt ? new Date(Ticket.createdAt).toLocaleString('vi-VN') : ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium">{Ticket.updatedAt ? new Date(Ticket.updatedAt).toLocaleString('vi-VN') : ''}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Mô tả chi tiết</h3>
          <div className="prose max-w-none text-sm">
             {Ticket.description ? <div dangerouslySetInnerHTML={{ __html: Ticket.description }} /> : <p className="text-gray-500 italic">Chưa có mô tả</p>}
          </div>
        </div>
      </div>
    </FormPageLayout>
  )
}
