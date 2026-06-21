import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check, AlertCircle } from 'lucide-react'
import { SupportGroupCategoryForm } from '../components/SupportGroupCategoryForm'
import { useSupportGroupCategoryDetail, useUpdateSupportGroupCategory } from '../hooks/useSupportGroupCategories'

export const SupportGroupCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateSupportGroupCategory()
  const submitRef = useRef<(() => void) | null>(null)

  // ====== DATA FETCHING ======
  const { data: category, isLoading, error } = useSupportGroupCategoryDetail(id || '')

  // ====== EVENT HANDLERS ======
  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  // ====== ERROR STATE ======
  if (error || !category) {
    return (
      <FormPageLayout
        title="Quản lý danh mục nhóm hỗ trợ"
        description="Quản lý danh sách danh mục nhóm hỗ trợ trong hệ thống"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý danh mục nhóm hỗ trợ', href: '/support-group-categories' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/support-group-categories')}
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
              Không tìm thấy danh mục nhóm hỗ trợ
            </h3>
            <p className="text-gray-600 mb-6">
              Danh mục nhóm hỗ trợ bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/support-group-categories')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </FormPageLayout>
    )
  }

  // ====== RENDER ======
  return (
    <FormPageLayout
      title="Quản lý danh mục nhóm hỗ trợ"
      description="Quản lý danh sách danh mục nhóm hỗ trợ trong hệ thống"
      formTitle={`Chỉnh sửa: ${category.name}`}
      breadcrumbItems={[
        { label: 'Quản lý danh mục nhóm hỗ trợ', href: '/support-group-categories' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/support-group-categories')}
            disabled={updateMutation.isPending || isLoading}
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
      {/* Form Component */}
      <SupportGroupCategoryForm
        initialData={category}
        onSuccess={() => navigate(`/support-group-categories/${id}`)}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}