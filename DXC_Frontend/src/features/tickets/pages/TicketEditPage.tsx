import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TicketForm } from '../components/TicketForm'
import { useTicketDetail } from '../hooks/useTickets'

export const TicketEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: detailData, isLoading } = useTicketDetail(id as string)

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy Ticket</div>

  return (
    <FormPageLayout
      title="Quản lý Vé"
      description="Quản lý các Vé dịch vụ"
      formTitle="Chỉnh sửa Vé"
      breadcrumbItems={[
        { label: 'Quản lý Vé', href: '/tickets' },
        { label: 'Chỉnh sửa', current: true }
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
      <TicketForm initialData={detailData.data} onSuccess={() => navigate('/tickets')} onSave={(submit) => { submitRef.current = submit }} />
    </FormPageLayout>
  )
}
