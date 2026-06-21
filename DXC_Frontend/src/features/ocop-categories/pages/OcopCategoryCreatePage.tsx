import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopCategoryForm } from '../components/OcopCategoryForm'
import { useCreateOcopCategory } from '../hooks/useOcopCategories'

export const OcopCategoryCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateOcopCategory()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Quản lý danh mục OCOP"
      description="Tạo danh mục sản phẩm OCOP mới"
      formTitle="Tạo danh mục mới"
      breadcrumbItems={[
        { label: 'Quản lý danh mục OCOP', href: '/ocop-categories' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-categories')}
            disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <OcopCategoryForm
        onSuccess={() => navigate('/ocop-categories')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default OcopCategoryCreatePage
