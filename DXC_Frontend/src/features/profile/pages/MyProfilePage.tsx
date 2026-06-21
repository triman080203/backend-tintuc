import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormPageLayout } from '@/shared/components'
import { getProfile } from '@/api/endpoints/profile'
import { getIdentity } from '@/api/endpoints/identity'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const MyProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => getProfile().getApiProfileMe(),
    staleTime: 5 * 60 * 1000,
  })

  const profile = data?.data

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        toast.error('Mật khẩu mới phải có ít nhất 8 ký tự')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp')
        return
      }
      setIsSubmitting(true)
      try {
        const res = await getIdentity().postApiIdentityResetMyPassword({ newPassword })
        if (res.success) {
          toast.success('Đổi mật khẩu thành công')
          setNewPassword('')
          setConfirmPassword('')
        } else {
          toast.error('Đổi mật khẩu thất bại', { description: res.message })
        }
      } catch (e: any) {
        toast.error('Đổi mật khẩu thất bại', { description: e.message })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast.info('Không có thay đổi để lưu')
    }
  }

  return (
    <FormPageLayout
      title="Hồ sơ cá nhân"
      description="Xem thông tin tài khoản và đặt lại mật khẩu"
      formTitle="Thông tin tài khoản"
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/dashboard' },
        { label: 'Hồ sơ cá nhân', current: true },
      ]}
      actionBarContent={
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={isSubmitting || isLoading}
          className="gap-2"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="fullName">Họ và tên</label>
          <Input id="fullName" value={profile?.fullName || ''} disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="userName">Tên đăng nhập</label>
          <Input id="userName" value={profile?.userName || ''} disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" value={profile?.email || ''} disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="newPassword">Mật khẩu mới</label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
          />
        </div>
      </div>
    </FormPageLayout>
  )
}

export default MyProfilePage
