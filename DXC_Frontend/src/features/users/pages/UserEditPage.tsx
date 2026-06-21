import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check, AlertCircle } from 'lucide-react'
import { UserForm } from '../components/UserForm'
import { useUserDetail } from '../hooks/useUserDetail'
import { useUpdateUser } from '../hooks/useUsers'

export const UserEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateUser()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: user, isLoading, error } = useUserDetail(id!)

  // ====== EVENT HANDLERS ======
  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  // ====== ERROR STATE ======
  if (error || !user) {
    return (
      <FormPageLayout
        title="Quản lý người dùng"
        description="Quản lý tài khoản và quyền truy cập của người dùng"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý người dùng', href: '/users' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/users')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy người dùng
            </h3>
            <p className="text-gray-600 mb-6">
              Người dùng bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </FormPageLayout>
    )
  }

  // ====== RENDER ======
  return (
    <FormPageLayout
      title="Quản lý người dùng"
      description="Quản lý tài khoản và quyền truy cập của người dùng"
      formTitle={`Chỉnh sửa: ${user.fullName || user.userName}`}
      breadcrumbItems={[
        { label: 'Quản lý người dùng', href: '/users' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/users/${id}`)}
            disabled={updateMutation.isPending || isLoading}
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
            onClick={() => navigate(`/users/${id}`)}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      {/* Form Component */}
      <UserForm
        user={user}
        onSuccess={() => navigate(`/users/${id}`)}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default UserEditPage