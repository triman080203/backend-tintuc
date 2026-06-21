import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopEnterpriseForm } from '../components/OcopEnterpriseForm'
import { useOcopEnterpriseDetail, useUpdateOcopEnterprise } from '../hooks/useOcopEnterprises'

export const OcopEnterpriseEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateOcopEnterprise()
  const submitRef = useRef<(() => void) | null>(null)

  const { data, isLoading, error } = useOcopEnterpriseDetail(id!)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (error || !data?.data) {
    return (
      <FormPageLayout
        formTitle="Không tìm thấy"
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
        <p className="text-center text-gray-600 py-8">
          Doanh nghiệp không tồn tại hoặc đã bị xóa.
        </p>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý doanh nghiệp OCOP"
      description="Chi tiết doanh nghiệp OCOP"
      formTitle={`Chỉnh sửa: ${data.data.name}`}
      breadcrumbItems={[
        { label: 'Quản lý doanh nghiệp OCOP', href: '/ocop-enterprises' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-enterprises')}
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
            onClick={() => navigate('/ocop-enterprises')}
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
      <OcopEnterpriseForm
        initialData={data.data}
        onSuccess={() => navigate('/ocop-enterprises')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default OcopEnterpriseEditPage
