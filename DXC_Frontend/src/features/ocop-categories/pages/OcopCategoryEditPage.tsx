import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopCategoryForm } from '../components/OcopCategoryForm'
import { useUpdateOcopCategory, useOcopCategoryDetail } from '../hooks/useOcopCategories'

export const OcopCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateOcopCategory()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: categoryData, isLoading, error } = useOcopCategoryDetail(id || '')

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (error || !categoryData) {
    return (
      <FormPageLayout
        formTitle="Không tìm thấy"
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
        <p className="text-center text-gray-600 py-8">
          Danh mục không tồn tại hoặc đã bị xóa.
        </p>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý danh mục OCOP"
      description="Chi tiết danh mục sản phẩm OCOP"
      formTitle={`Chỉnh sửa: ${categoryData.name}`}
      breadcrumbItems={[
        { label: 'Quản lý danh mục OCOP', href: '/ocop-categories' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-categories')}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-categories')}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <OcopCategoryForm
        initialData={categoryData}
        onSuccess={() => navigate('/ocop-categories')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default OcopCategoryEditPage
