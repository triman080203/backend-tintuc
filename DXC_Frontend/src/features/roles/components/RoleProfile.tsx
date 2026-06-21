import type { RoleDto } from '@/api/models'

interface RoleProfileProps {
  role: RoleDto | null | undefined
}

export const RoleProfile = ({ role }: RoleProfileProps) => {
  if (!role) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Name and Code Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên</h3>
          <p className="text-lg text-gray-900">{role.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã</h3>
          <p className="text-lg text-gray-900 font-mono">{role.code || '-'}</p>
        </div>
      </div>

      {/* Description Section */}
      {role.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{role.description}</p>
        </div>
      )}

      {/* Metadata Section */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">ID hệ thống</h3>
          <p className="text-gray-600 font-mono">{role.publicId || '-'}</p>
        </div>
      </div>
    </div>
  )
}

export default RoleProfile
