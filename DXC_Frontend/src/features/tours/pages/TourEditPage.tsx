import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TourForm } from '../components/TourForm'
import { useTourDetail } from '../hooks/useTours'

export const TourEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: detailData, isLoading } = useTourDetail(id as string)

  if (isLoading) return <div>Đang tải...</div>
  if (!detailData?.data) return <div>Không tìm thấy tour</div>

  return (
    <FormPageLayout
      title="Quản lý Tour"
      description="Quản lý các tour du lịch"
      formTitle="Chỉnh sửa tour"
      breadcrumbItems={[
        { label: 'Quản lý tour', href: '/tours' },
        { label: 'Chỉnh sửa', current: true }
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
      <TourForm initialData={detailData.data} onSuccess={() => navigate('/tours')} onSave={(submit) => { submitRef.current = submit }} />
    </FormPageLayout>
  )
}
