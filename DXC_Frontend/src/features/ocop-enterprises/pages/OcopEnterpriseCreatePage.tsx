import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopEnterpriseForm } from '../components/OcopEnterpriseForm'
import { useCreateOcopEnterprise } from '../hooks/useOcopEnterprises'

export const OcopEnterpriseCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateOcopEnterprise()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Quản lý doanh nghiệp OCOP"
      description="Tạo doanh nghiệp OCOP mới"
      formTitle="Tạo doanh nghiệp mới"
      breadcrumbItems={[
        { label: 'Quản lý doanh nghiệp OCOP', href: '/ocop-enterprises' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-enterprises')}
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
            onClick={() => navigate('/ocop-enterprises')}
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
      <OcopEnterpriseForm
        onSuccess={() => navigate('/ocop-enterprises')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default OcopEnterpriseCreatePage
