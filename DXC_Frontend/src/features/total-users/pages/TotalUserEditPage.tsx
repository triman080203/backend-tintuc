import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout } from '@/shared/components/FormPageLayout'
import { ActionBarDivider } from '@/shared/components/ActionBar'
import { ChevronLeft, X, Check, AlertCircle } from 'lucide-react'
import { TotalUserForm } from '../components/TotalUserForm'
import { useTotalUserDetail, useUpdateTotalUser } from '../hooks/useTotalUsers'
import { useQueryClient } from '@tanstack/react-query'

export const TotalUserEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, error } = useTotalUserDetail(Number(id))
  const updateMutation = useUpdateTotalUser()
  const submitRef = useRef<(() => void) | null>(null)
  const qc = useQueryClient()

  const handleSave = () => {
    submitRef.current?.()
  }

  const handleSubmit = (values: { userId: string; username: string; avatar?: string; phanQuyen?: boolean }) => {
    if (!id) return
    const current = data?.data
    const nextAvatar = (values.avatar && values.avatar.trim()) ? values.avatar : (current?.avatar || null)
    updateMutation.mutate({
      id: Number(id),
      userId: values.userId,
      username: values.username,
      avatar: nextAvatar,
      phanQuyen: values.phanQuyen ? 'true' : 'false',
    }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['total-users'] })
        qc.invalidateQueries({ queryKey: ['total-user', Number(id)] })
        navigate(`/total-users/${id}`)
      }
    })
  }

  if (error || !data?.data) {
    return (
      <FormPageLayout
        title="Thống kê người dùng"
        description="Không tìm thấy dữ liệu"
        formTitle="Chỉnh sửa người dùng"
        breadcrumbItems={[{ label: 'Thống kê người dùng', href: '/total-users' }, { label: 'Chỉnh sửa', current: true }]}
        actionBarContent={
          <Button variant="ghost" size="sm" onClick={() => navigate('/total-users')} className="gap-2" aria-label="Quay lại">
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-4 h-4" /> Không tìm thấy</div>
      </FormPageLayout>
    )
  }

  const item = data.data

  return (
    <FormPageLayout
      title="Thống kê người dùng"
      description="Cập nhật thông tin người dùng"
      formTitle="Chỉnh sửa người dùng"
      breadcrumbItems={[{ label: 'Thống kê người dùng', href: '/total-users' }, { label: 'Chỉnh sửa', current: true }]}
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate(`/total-users/${id}`)} disabled={updateMutation.isPending} className="gap-2" aria-label="Quay lại">
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={() => navigate(`/total-users/${id}`)} disabled={updateMutation.isPending} className="gap-2" aria-label="Hủy">
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="gap-2" aria-label="Lưu">
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <TotalUserForm
        defaultValues={item}
        onSave={(submit) => { submitRef.current = submit }}
        onSubmit={handleSubmit}
      />
    </FormPageLayout>
  )
}
