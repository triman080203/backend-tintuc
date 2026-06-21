import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TicketForm } from '../components/TicketForm'

export const TicketCreatePage = () => {
  const navigate = useNavigate()
  const submitRef = useRef<(() => void) | null>(null)

  return (
    <FormPageLayout
      title="Quản lý Vé"
      description="Quản lý các Vé dịch vụ"
      formTitle="Tạo Vé mới"
      breadcrumbItems={[
        { label: 'Quản lý Vé', href: '/tickets' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/tickets')} className="gap-2">
            <ChevronLeft className="w-4 h-4 text-blue-600" /> Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate('/tickets')} className="gap-2">
            <X className="w-4 h-4 text-blue-600" /> Hủy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => submitRef.current?.()} className="gap-2">
            <Check className="w-4 h-4 text-blue-600" /> Lưu
          </Button>
        </>
      }
    >
      <TicketForm onSuccess={() => navigate('/tickets')} onSave={(submit) => { submitRef.current = submit }} />
    </FormPageLayout>
  )
}
