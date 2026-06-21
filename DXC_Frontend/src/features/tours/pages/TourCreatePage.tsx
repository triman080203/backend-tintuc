import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TourForm } from '../components/TourForm'

export const TourCreatePage = () => {
  const navigate = useNavigate()
  const submitRef = useRef<(() => void) | null>(null)

  return (
    <FormPageLayout
      title="Quản lý Tour"
      description="Quản lý các tour du lịch"
      formTitle="Tạo tour mới"
      breadcrumbItems={[
        { label: 'Quản lý tour', href: '/tours' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tours')} className="gap-2">
            <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate('/tours')} className="gap-2">
            <X className="w-4 h-4 text-blue-600" /> Hủy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => submitRef.current?.()} className="gap-2">
            <Check className="w-4 h-4 text-blue-600" /> Lưu
          </Button>
        </>
      }
    >
      <TourForm onSuccess={() => navigate('/tours')} onSave={(submit) => { submitRef.current = submit }} />
    </FormPageLayout>
  )
}
