import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OrganizationForm } from '../components/OrganizationForm'
import { useCreateOrganization } from '../hooks/useOrganizations'

export const OrganizationCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateOrganization()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
    title="Quản lý đơn vị"
      description="Quản lý các đơn vị trong hệ thống."
      formTitle="Tạo đơn vị mới"
      breadcrumbItems={[
        { label: 'Quản lý đơn vị', href: '/organizations' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organizations')}
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
            onClick={() => navigate('/organizations')}
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
      <OrganizationForm 
        onSuccess={() => navigate('/organizations')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
