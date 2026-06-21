import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { useCreateKhaoSat } from '../hooks/useKhaoSat'
import { KhaoSatForm } from '../components/KhaoSatForm'

export const KhaoSatCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateKhaoSat()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate('/khaosat'),
    })
  }

  return (
    <FormPageLayout
      title="Tạo khảo sát"
      formTitle="Thông tin khảo sát"
      description="Nhập thông tin khảo sát"
      breadcrumbItems={[
        { label: 'Quản lý khảo sát', href: '/khaosat' },
        { label: 'Tạo khảo sát', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/khaosat')}
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
            onClick={() => navigate('/khaosat')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (submitRef.current) submitRef.current()
            }}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <KhaoSatForm
        initial={null}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending}
        mode="create"
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
