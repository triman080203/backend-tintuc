import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { IconCategoryForm } from '../components/IconCategoryForm'
import { useCreateIconCategory } from '../hooks/useIconCategories'

export const IconCategoryCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateIconCategory()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Quản lý danh mục icon"
      description="Quản lý danh sách danh mục icon trong hệ thống"
      formTitle="Tạo danh mục icon mới"
      breadcrumbItems={[
        { label: 'Quản lý danh mục icon', href: '/icon-categories' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/icon-categories')}
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
            onClick={() => navigate('/icon-categories')}
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
      <IconCategoryForm
        onSuccess={() => navigate('/icon-categories')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
