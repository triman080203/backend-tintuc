import { Mail } from 'lucide-react'
import type { UserDto } from '@/api/models'

interface UserProfileProps {
  user: UserDto
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Name and Username Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên đầy đủ</h3>
          <p className="text-lg text-gray-900">{user.fullName || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên đăng nhập</h3>
          <p className="text-lg text-gray-900 font-mono">{user.userName || '-'}</p>
        </div>
      </div>

      {/* Email Section */}
      {user.email && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Email</h3>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <a 
              href={`mailto:${user.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {user.email}
            </a>
          </div>
        </div>
      )}

      {/* Roles Section */}
      {user.roleCodes && user.roleCodes.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Vai trò</h3>
          <p className="text-gray-700">{user.roleCodes.join(', ')}</p>
        </div>
      )}

      {/* Organization and Department Section */}
      {(user.organizationName || user.departmentName) && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Đơn vị & Phòng ban</h3>
          <div className="space-y-3">
            {user.organizationName && (
              <div>
                <p className="text-sm text-gray-600">Đơn vị</p>
                <p className="text-gray-700">{user.organizationName}</p>
              </div>
            )}
            {user.departmentName && (
              <div>
                <p className="text-sm text-gray-600">Phòng ban</p>
                <p className="text-gray-700">{user.departmentName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata Section */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Trạng thái</h3>
          <p className="text-gray-600">
            {user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">{formatDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile