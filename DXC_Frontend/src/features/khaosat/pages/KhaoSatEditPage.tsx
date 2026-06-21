import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check, AlertCircle } from 'lucide-react'
import { useKhaoSatDetail, useUpdateKhaoSat } from '../hooks/useKhaoSat'
import { KhaoSatForm } from '../components/KhaoSatForm'
import type { SurveyDetailDto } from '@/api/models'

export const KhaoSatEditPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const id = Number(params.id)
  const { data, isLoading } = useKhaoSatDetail(id)
  const updateMutation = useUpdateKhaoSat()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSubmit = (payload: any) => {
    updateMutation.mutate(payload, {
      onSuccess: () => navigate('/khaosat'),
    })
  }

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>
  }

  const initial = data as SurveyDetailDto
  const surveyId = initial?.id || ''

  return (
    <FormPageLayout
      title="Chỉnh sửa khảo sát"
      formTitle="Thông tin khảo sát"
      description="Cập nhật thông tin khảo sát"
      breadcrumbItems={[
        { label: 'Quản lý khảo sát', href: '/khaosat' },
        { label: `Sửa #${surveyId}`, current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/khaosat/${id}`)}
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
            onClick={() => navigate('/khaosat')}
            disabled={updateMutation.isPending}
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
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      {!initial ? (
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khảo sát</h3>
            <p className="text-gray-600 mb-6">Khảo sát bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
            <Button variant="outline" onClick={() => navigate('/khaosat')}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      ) : (
        <KhaoSatForm
          initial={initial}
          onSubmit={handleSubmit}
          submitting={updateMutation.isPending}
          mode="edit"
          onSave={(submit) => {
            submitRef.current = submit
          }}
        />
      )}
    </FormPageLayout>
  )
}
