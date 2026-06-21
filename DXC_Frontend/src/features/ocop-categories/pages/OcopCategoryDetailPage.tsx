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
import { OcopCategoryProfile } from '../components/OcopCategoryProfile'
import { ImageGallery } from '../components/ImageGallery'
import { useOcopCategoryDetail, useDeleteOcopCategory } from '../hooks/useOcopCategories'

export const OcopCategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: categoryData, isLoading, error } = useOcopCategoryDetail(id || '')

  const deleteQuery = useDeleteOcopCategory()

  const handleEdit = () => {
    navigate(`/ocop-categories/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/ocop-categories')
      },
    })
  }

  if (error || !categoryData) {
    return (
      <DetailPageLayout
        title="Quản lý danh mục OCOP"
        description="Chi tiết danh mục sản phẩm OCOP"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý danh mục OCOP', href: '/ocop-categories' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-categories')}
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
              Không tìm thấy danh mục
            </h3>
            <p className="text-gray-600 mb-6">
              Danh mục bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/ocop-categories')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  return (
    <DetailPageLayout
      title="Quản lý danh mục OCOP"
      description="Chi tiết danh mục sản phẩm OCOP"
      objectName={categoryData.name || 'Chi tiết danh mục'}
      breadcrumbItems={[
        { label: 'Quản lý danh mục OCOP', href: '/ocop-categories' },
        { label: categoryData.name || 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-categories')}
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
      <OcopCategoryProfile category={categoryData} />

      {categoryData.imageUrl && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Ảnh danh mục</h3>
          <ImageGallery category={categoryData} />
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa danh mục?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Danh mục sẽ bị xóa vĩnh viễn.
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

export default OcopCategoryDetailPage
