import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Check, Trash2 } from 'lucide-react'
import { TinTucCategoryForm } from '../components/TinTucCategoryForm'
import { useTinTucCategoryDetail } from '../hooks'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import { useDeleteConfirm } from '@/shared/hooks'
import { DeleteConfirmDialog } from '@/shared/components/DeleteConfirmDialog'
import type { TinTucCategoryFormData } from '../schemas'

export const TinTucCategoryUpdatePage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const FORM_ID = 'tin-tuc-category-update-form'

  const { data: detailRes, isLoading: isFetching } = useTinTucCategoryDetail(id || '')
  const detail = detailRes?.data

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: (data: TinTucCategoryFormData) => {
      return getTinTucAdmin().putApiAdminTintucCategoriesPublicId(id!, {
        publicId: id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      })
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Cập nhật danh mục thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-category-list'] })
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-category-detail', id] })
        navigate('/tin-tuc/categories')
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Không thể kết nối đến máy chủ')
    }
  })

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: () => getTinTucAdmin().deleteApiAdminTintucCategoriesPublicId(id!),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Xóa danh mục thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-category-list'] })
        navigate('/tin-tuc/categories')
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Không thể kết nối đến máy chủ')
    }
  })

  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
    confirm: confirmDelete,
  } = useDeleteConfirm(deleteCategory)

  if (isFetching) {
    return <div>Đang tải...</div>
  }

  if (!detail) {
    return <div>Không tìm thấy dữ liệu</div>
  }

  return (
    <>
      <FormPageLayout
        title="Cập nhật danh mục"
        description="Chỉnh sửa thông tin chuyên mục tin bài"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', href: '/tin-tuc' },
          { label: 'Danh mục', href: '/tin-tuc/categories' },
          { label: detail.name, current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tin-tuc/categories')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>
            <ActionBarDivider />
            <Button
              variant="destructive"
              size="sm"
              onClick={openDelete}
              disabled={isUpdating || isDeleting}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              size="sm"
              className="gap-2"
              disabled={isUpdating || isDeleting}
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="max-w-[800px] mx-auto">
          <TinTucCategoryForm
            formId={FORM_ID}
            initialData={detail}
            onSubmit={(data) => updateCategory(data)}
            isLoading={isUpdating || isDeleting}
          />
        </div>
      </FormPageLayout>

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác và chỉ thực hiện được nếu danh mục không có bài viết nào."
        isLoading={isDeleting}
      />
    </>
  )
}
