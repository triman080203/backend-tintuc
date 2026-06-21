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
import { ChevronLeft, Edit, Trash2 } from 'lucide-react'
import HotlineProfile from '../components/HotlineProfile'
import { useHotlineDetail, useDeleteHotline } from '../hooks/useHotlines'

export const HotlineDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { data, isLoading } = useHotlineDetail(id || '')
  const deleteQuery = useDeleteHotline()

  const handleDelete = () => {
    deleteQuery.mutate(id || '', {
      onSuccess: () => {
        navigate('/hotlines')
      },
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (!data?.data) {
    return (
      <DetailPageLayout
        title="Quản lý Hotline"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý Hotline', href: '/hotlines' },
          { label: 'Chi tiết', current: true },
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotlines')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Hotline này không tồn tại</p>
        </div>
      </DetailPageLayout>
    )
  }

  return (
    <>
      <DetailPageLayout
        title="Quản lý Hotline"
        objectName={data.data.contactName || 'Chi tiết Hotline'}
        breadcrumbItems={[
          { label: 'Quản lý Hotline', href: '/hotlines' },
          { label: 'Chi tiết', current: true },
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotlines')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/hotlines/${id}/edit`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              Sửa
            </Button>

            <ActionBarDivider />

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
        <HotlineProfile item={data.data} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa Hotline?</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác. Hotline sẽ bị xóa vĩnh viễn.
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

export default HotlineDetailPage
