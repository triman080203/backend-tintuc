import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit } from 'lucide-react'
import { useTourDetail } from '../hooks/useTours'

export const TourDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: detailData, isLoading } = useTourDetail(id as string)

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy tour</div>

  const tour = detailData.data

  return (
    <FormPageLayout
      title="Chi tiết Tour"
      description="Xem chi tiết thông tin tour"
      formTitle={tour.name || 'Chi tiết tour'}
      breadcrumbItems={[
        { label: 'Quản lý tour', href: '/tours' },
        { label: 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tours')} className="gap-2">
            <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate(`/tours/${id}/edit`)} className="gap-2">
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
              <p className="text-sm text-gray-500">Tên tour</p>
              <p className="font-medium">{tour.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className="font-medium">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {tour.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giá tour</p>
              <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời gian</p>
              <p className="font-medium">{tour.durationDays} ngày {tour.durationNights} đêm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Địa điểm xuất phát</p>
              <p className="font-medium">{tour.departureLocation || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng tối đa</p>
              <p className="font-medium">{tour.maxParticipants} người</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thứ tự hiển thị</p>
              <p className="font-medium">{tour.thuTu}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium">{tour.createdAt ? new Date(tour.createdAt).toLocaleString('vi-VN') : ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium">{tour.updatedAt ? new Date(tour.updatedAt).toLocaleString('vi-VN') : ''}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Mô tả chi tiết</h3>
          <div className="prose max-w-none text-sm">
             {tour.description ? <div dangerouslySetInnerHTML={{ __html: tour.description }} /> : <p className="text-gray-500 italic">Chưa có mô tả</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Điểm nổi bật</h3>
          <div className="prose max-w-none text-sm">
            {tour.highlights ? <div dangerouslySetInnerHTML={{ __html: tour.highlights }} /> : <p className="text-gray-500 italic">Chưa có điểm nổi bật</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Lịch trình</h3>
          <div className="prose max-w-none text-sm">
            {tour.schedule ? <div dangerouslySetInnerHTML={{ __html: tour.schedule }} /> : <p className="text-gray-500 italic">Chưa có lịch trình</p>}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Hình ảnh</h3>
          {tour.images && tour.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tour.images.map(img => (
                <div key={img.publicId} className="relative aspect-square rounded-md overflow-hidden border">
                  <img src={img.imageUrl!} alt="Tour image" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Chưa có hình ảnh</p>
          )}
        </div>
      </div>
    </FormPageLayout>
  )
}
