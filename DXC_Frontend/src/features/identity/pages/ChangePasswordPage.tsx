import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormPageLayout } from '@/shared/components'
import { getIdentity } from '@/api/endpoints/identity'
import { toast } from 'sonner'

export const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có ít nhất 8 ký tự')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await getIdentity().postApiIdentityChangePassword({
        currentPassword,
        newPassword,
      })
      if (res.success) {
        toast.success('Đổi mật khẩu thành công')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        toast.error('Đổi mật khẩu thất bại', { description: res.message })
      }
    } catch (e: any) {
      toast.error('Đổi mật khẩu thất bại', { description: e.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormPageLayout
      title="Đổi mật khẩu"
      description="Cập nhật mật khẩu đăng nhập của bạn"
      formTitle="Thông tin đổi mật khẩu"
      breadcrumbItems={[
        { label: 'Tài khoản', href: '/dashboard' },
        { label: 'Đổi mật khẩu', current: true },
      ]}
    >
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="currentPassword">Mật khẩu hiện tại</label>
          <Input
            id="currentPassword"
            type="password"
            aria-label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="newPassword">Mật khẩu mới</label>
          <Input
            id="newPassword"
            type="password"
            aria-label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPassword('')
              setNewPassword('')
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
    </FormPageLayout>
  )
}

export default ChangePasswordPage
