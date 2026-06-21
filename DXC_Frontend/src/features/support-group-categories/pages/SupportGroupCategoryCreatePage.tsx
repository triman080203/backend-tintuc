import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { SupportGroupCategoryForm } from '../components/SupportGroupCategoryForm'
import { useCreateSupportGroupCategory } from '../hooks/useSupportGroupCategories'

export const SupportGroupCategoryCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateSupportGroupCategory()
  const submitRef = useRef<(() => void) | null>(null)

  // ====== EVENT HANDLERS ======
  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  // ====== RENDER ======
  return (
    <FormPageLayout
      title="Quản lý danh mục nhóm hỗ trợ"
      description="Quản lý danh sách danh mục nhóm hỗ trợ trong hệ thống"
      formTitle="Tạo danh mục nhóm hỗ trợ mới"
      breadcrumbItems={[
        { label: 'Quản lý danh mục nhóm hỗ trợ', href: '/support-group-categories' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/support-group-categories')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          {/* Divider */}
          <ActionBarDivider />

          {/* Form Actions: Cancel, Save */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/support-group-categories')}
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
      {/* Form Component */}
      <SupportGroupCategoryForm
        onSuccess={() => navigate('/support-group-categories')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}