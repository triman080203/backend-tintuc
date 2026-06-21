import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, Trash2, AlertCircle } from 'lucide-react'
import { HotelProfile } from '../components/HotelProfile'
import { ImageGallery } from '../components/ImageGallery'
import { useHotelDetail, useDeleteHotel } from '../hooks/useHotels'

export const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = useHotelDetail(id || '')
  const deleteQuery = useDeleteHotel()

  // ====== EVENT HANDLERS ======
  const handleEdit = () => {
    navigate(`/hotels/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/hotels')
      },
    })
  }

  // ====== ERROR STATE ======
  if (error || !data) {
    return (
      <DetailPageLayout
        title="Quản lý khách sạn"
        description="Quản lý danh sách khách sạn trong hệ thống"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý khách sạn', href: '/hotels' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotels')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy khách sạn
            </h3>
            <p className="text-gray-600 mb-6">
              Khách sạn bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/hotels')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const hotel = data

  // ====== RENDER ======
  return (
    <>
      <DetailPageLayout
        title="Quản lý khách sạn"
        description="Quản lý danh sách khách sạn trong hệ thống"
        objectName={hotel.name || 'Chi tiết khách sạn'}
        breadcrumbItems={[
          { label: 'Quản lý khách sạn', href: '/hotels' },
          { label: hotel.name || 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            {/* Navigation: Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotels')}
              disabled={isLoading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            {/* Divider between groups */}
            <ActionBarDivider />

            {/* Action: Edit */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
              className="gap-2"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              Chỉnh sửa
            </Button>

            {/* Divider */}
            <ActionBarDivider />

            {/* Action: Delete */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteQuery.isPending}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Xóa
            </Button>
          </>
        }
      >
        {/* Detail Content */}
        <div className="space-y-6">
          <HotelProfile hotel={hotel} />

          {/* Images Section */}
          {hotel.images && hotel.images.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Ảnh</h3>
              <ImageGallery images={hotel.images} />
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa khách sạn?</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác. Khách sạn sẽ bị xóa vĩnh viễn.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteQuery.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteQuery.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteQuery.isPending ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DetailPageLayout>
    </>
  )
}
