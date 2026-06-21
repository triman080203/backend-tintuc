import type { IconDto } from '@/api/models'

interface IconProfileProps {
  icon: IconDto | null | undefined
}

export const IconProfile = ({ icon }: IconProfileProps) => {
  if (!icon) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tên icon</p>
            <p className="text-gray-900">{icon.name || '-'}</p>
          </div>

          {icon.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{icon.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Nhóm icon</p>
            <p className="text-gray-900">{icon.iconGroupName || '-'}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Danh mục icon</p>
            <p className="text-gray-900">{icon.iconCategoryName || '-'}</p>
          </div>

          {icon.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Ngày tạo</p>
              <p className="text-gray-900">
                {new Date(icon.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}

          {icon.updatedAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Cập nhật lần cuối</p>
              <p className="text-gray-900">
                {new Date(icon.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}

          {((icon as any)?.linkAndroid || (icon as any)?.linkIOS) && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Liên kết Android</p>
                <a
                  href={(icon as any)?.linkAndroid || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                  aria-label="Liên kết Android"
                >
                  {(icon as any)?.linkAndroid || '-'}
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Liên kết iOS</p>
                <a
                  href={(icon as any)?.linkIOS || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                  aria-label="Liên kết iOS"
                >
                  {(icon as any)?.linkIOS || '-'}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
