import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Check } from 'lucide-react'
import { TinTucCategoryForm } from '../components/TinTucCategoryForm'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { TinTucCategoryFormData } from '../schemas'

export const TinTucCategoryCreatePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const FORM_ID = 'tin-tuc-category-create-form'

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: (data: TinTucCategoryFormData) => {
      return getTinTucAdmin().postApiAdminTintucCategories({
        name: data.name,
        slug: data.slug,
        description: data.description,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      })
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Tạo danh mục thành công')
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

  return (
    <FormPageLayout
      title="Thêm danh mục mới"
      description="Tạo chuyên mục để phân loại tin tức"
      breadcrumbItems={[
        { label: 'Quản lý tin tức', href: '/tin-tuc' },
        { label: 'Danh mục', href: '/tin-tuc/categories' },
        { label: 'Thêm mới', current: true }
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
            type="submit"
            form={FORM_ID}
            size="sm"
            className="gap-2"
            disabled={isPending}
          >
            <Check className="w-4 h-4" />
            Lưu danh mục
          </Button>
        </>
      }
    >
      <div className="max-w-[800px] mx-auto">
        <TinTucCategoryForm
          formId={FORM_ID}
          onSubmit={(data) => createCategory(data)}
          isLoading={isPending}
        />
      </div>
    </FormPageLayout>
  )
}
