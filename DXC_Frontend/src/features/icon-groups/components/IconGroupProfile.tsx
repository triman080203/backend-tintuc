import { Badge } from '@/components/ui/badge'
import type { IconGroupDto } from '@/api/models'

interface IconGroupProfileProps {
  group: IconGroupDto | null | undefined
}

export const IconGroupProfile = ({ group }: IconGroupProfileProps) => {
  if (!group) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tên nhóm</p>
            <p className="text-gray-900">{group.name || '-'}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</p>
            <Badge variant={group.isActive ? 'default' : 'secondary'}>
              {group.isActive ? 'Hoạt động' : 'Vô hiệu'}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Danh mục icon</p>
            <p className="text-gray-900">{group.iconCategoryName || '-'}</p>
          </div>

          {group.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{group.description}</p>
            </div>
          )}

          {group.displayOrder !== undefined && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Thứ tự hiển thị</p>
              <p className="text-gray-900">{group.displayOrder ?? '-'}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Số icon</p>
            <p className="text-gray-900">{group.totalIcons ?? 0}</p>
          </div>

          {group.imageUrl && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Ảnh nhóm</p>
              <img
                src={group.imageUrl || ''}
                alt="Icon Group"
                className="max-w-sm h-32 object-cover rounded-md border"
              />
            </div>
          )}

          {group.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Ngày tạo</p>
              <p className="text-gray-900">
                {new Date(group.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
