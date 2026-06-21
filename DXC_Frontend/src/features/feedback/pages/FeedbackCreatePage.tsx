import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { FeedbackForm } from '../components'
import { useCreateFeedback } from '../hooks'
import type { FeedbackFormData } from '../schemas'

const FeedbackCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateFeedback()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSubmit = (data: FeedbackFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/feedback')
      }
    })
  }

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Điều phối phản ánh"
      description="Điều phối các phản ánh đã gửi từ người dân và doanh nghiệp"
      formTitle="Tạo phản ánh mới"
      breadcrumbItems={[
        { label: 'Quản lý phản ánh', href: '/feedback' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/feedback')}
            disabled={createMutation.isPending}
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
            onClick={() => navigate('/feedback')}
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
      {/* Form Component */}
      <FeedbackForm
        onSubmit={handleSubmit}
        isEdit={false}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default FeedbackCreatePage
