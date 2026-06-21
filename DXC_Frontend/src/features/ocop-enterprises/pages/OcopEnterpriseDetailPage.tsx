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
import { OcopEnterpriseProfile } from '../components/OcopEnterpriseProfile'
import { useOcopEnterpriseDetail, useDeleteOcopEnterprise } from '../hooks/useOcopEnterprises'

export const OcopEnterpriseDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data, isLoading, error } = useOcopEnterpriseDetail(id!)
  const deleteQuery = useDeleteOcopEnterprise()

  const handleEdit = () => {
    navigate(`/ocop-enterprises/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/ocop-enterprises')
      },
    })
  }

  if (error || !data?.data) {
    return (
      <DetailPageLayout
        title="Quản lý doanh nghiệp OCOP"
        description="Chi tiết doanh nghiệp OCOP"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý doanh nghiệp OCOP', href: '/ocop-enterprises' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-enterprises')}
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
              Không tìm thấy doanh nghiệp
            </h3>
            <p className="text-gray-600 mb-6">
              Doanh nghiệp bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/ocop-enterprises')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const item = data.data

  return (
    <DetailPageLayout
      title="Quản lý doanh nghiệp OCOP"
      description="Chi tiết doanh nghiệp OCOP"
      objectName={item.name || 'Chi tiết doanh nghiệp'}
      breadcrumbItems={[
        { label: 'Quản lý doanh nghiệp OCOP', href: '/ocop-enterprises' },
        { label: item.name || 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-enterprises')}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

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
      <OcopEnterpriseProfile enterprise={item} />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa doanh nghiệp?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Doanh nghiệp sẽ bị xóa vĩnh viễn.
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
  )
}

export default OcopEnterpriseDetailPage
