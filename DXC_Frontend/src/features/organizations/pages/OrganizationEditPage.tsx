import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OrganizationForm } from '../components/OrganizationForm'
import { useOrganizationDetail } from '../hooks/useOrganizationDetail'
import { useUpdateOrganization } from '../hooks/useOrganizations'

export const OrganizationEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: organizationResponse, isLoading, error } = useOrganizationDetail(id!)
  const updateMutation = useUpdateOrganization()
  const submitRef = useRef<(() => void) | null>(null)

  const organization = organizationResponse?.data

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (error || !organization) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-600 mb-4">Không tìm thấy đơn vị</p>
        <button
          onClick={() => navigate('/organizations')}
          className="text-blue-600 hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <FormPageLayout
    title="Quản lý đơn vị"
      description="Quản lý các đơn vị trong hệ thống."
      formTitle="Chỉnh sửa đơn vị"
      breadcrumbItems={[
        { label: 'Quản lý đơn vị', href: '/organizations' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organizations')}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          <ActionBarDivider />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organizations')}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <OrganizationForm 
        initialData={organization}
        onSuccess={() => navigate('/organizations')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
