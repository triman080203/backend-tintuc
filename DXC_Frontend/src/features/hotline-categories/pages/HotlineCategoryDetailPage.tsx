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
import { HotlineCategoryProfile } from '../components/HotlineCategoryProfile'
import { useHotlineCategoryDetail, useDeleteHotlineCategory } from '../hooks/useHotlineCategories'

export const HotlineCategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = useHotlineCategoryDetail(id || '')
  const deleteQuery = useDeleteHotlineCategory()

  // ====== EVENT HANDLERS ======
  const handleEdit = () => {
    navigate(`/hotline-categories/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(
      { publicId: id! },
      {
        onSuccess: () => {
          navigate('/hotline-categories')
        },
      }
    )
  }

  // ====== ERROR STATE ======
  if (error || !data) {
    return (
      <DetailPageLayout
        title="Quản lý danh mục Hotline"
        description="Quản lý danh sách danh mục hotline trong hệ thống"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý danh mục Hotline', href: '/hotline-categories' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotline-categories')}
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
              Không tìm thấy danh mục Hotline
            </h3>
            <p className="text-gray-600 mb-6">
              Danh mục Hotline bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/hotline-categories')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const category = data

  // ====== RENDER ======
  return (
    <>
      <DetailPageLayout
        title="Quản lý danh mục Hotline"
        description="Quản lý danh sách danh mục hotline trong hệ thống"
        objectName={category.name || 'Chi tiết danh mục'}
        breadcrumbItems={[
          { label: 'Quản lý danh mục Hotline', href: '/hotline-categories' },
          { label: category.name || 'Chi tiết', current: true }
        ]
        }
        actionBarContent={
          <>
            {/* Navigation: Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotline-categories')}
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
        <HotlineCategoryProfile category={category} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa danh mục Hotline?</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác. Danh mục Hotline sẽ bị xóa vĩnh viễn.
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
