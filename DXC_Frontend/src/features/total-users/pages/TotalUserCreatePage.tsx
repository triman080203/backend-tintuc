import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout } from '@/shared/components/FormPageLayout'
import { ActionBarDivider } from '@/shared/components/ActionBar'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TotalUserForm } from '../components/TotalUserForm'
import { useCreateTotalUser } from '../hooks/useTotalUsers'

export const TotalUserCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateTotalUser()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    submitRef.current?.()
  }

  const handleSubmit = (values: { userId: string; username: string; avatar?: string; phanQuyen?: boolean }) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate('/total-users')
    })
  }

  return (
    <FormPageLayout
      title="Thống kê người dùng"
      description="Tạo người dùng tổng hợp mới"
      formTitle="Thêm người dùng"
      breadcrumbItems={[{ label: 'Thống kê người dùng', href: '/total-users' }, { label: 'Tạo mới', current: true }]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/total-users')}
            disabled={createMutation.isPending}
            className="gap-2"
            aria-label="Quay lại danh sách"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          <ActionBarDivider />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/total-users')}
            disabled={createMutation.isPending}
            className="gap-2"
            aria-label="Hủy tạo"
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
            aria-label="Lưu người dùng"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <TotalUserForm
        onSave={(submit) => { submitRef.current = submit }}
        onSubmit={handleSubmit}
      />
    </FormPageLayout>
  )
}

