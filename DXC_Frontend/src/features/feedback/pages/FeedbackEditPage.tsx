import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, ChevronLeft, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { FeedbackForm } from '../components'
import { useFeedbackDetail, useUpdateFeedback } from '../hooks'
import type { FeedbackFormData } from '../schemas'

const FeedbackEditPage = () => {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useFeedbackDetail(publicId || '', !!publicId)
  const updateMutation = useUpdateFeedback()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSubmit = (formData: FeedbackFormData) => {
    if (!publicId) return

    updateMutation.mutate(
      {
        publicId,
        ...formData,
      },
      {
        onSuccess: () => {
          navigate(`/feedback/${publicId}`)
        },
      }
    )
  }

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data?.data) {
    return (
      <FormPageLayout
        title="Điều phối phản ánh"
        description="Điều phối các phản ánh đã gửi từ người dân và doanh nghiệp"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý phản ánh', href: '/feedback' },
          { label: 'Chỉnh sửa', current: true }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feedback')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy phản ánh</p>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Điều phối phản ánh"
      description="Điều phối các phản ánh đã gửi từ người dân và doanh nghiệp"
      formTitle="Chỉnh sửa phản ánh"
      breadcrumbItems={[
        { label: 'Quản lý phản ánh', href: '/feedback' },
        { label: data.data.title || 'Chi tiết', href: `/feedback/${publicId}` },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/feedback/${publicId}`)}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          {/* Divider */}
          <ActionBarDivider />

          {/* Form Actions: Cancel, Save */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/feedback/${publicId}`)}
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
      {/* Form Component */}
      <FeedbackForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isEdit={true}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default FeedbackEditPage
