import { Badge } from '@/components/ui/badge'
import type { IconCategoryDto } from '@/api/models'

interface IconCategoryProfileProps {
  category: IconCategoryDto | null | undefined
}

export const IconCategoryProfile = ({ category }: IconCategoryProfileProps) => {
  if (!category) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tên danh mục</p>
            <p className="text-gray-900">{category.name || '-'}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</p>
            <Badge variant={category.isActive ? 'default' : 'secondary'}>
              {category.isActive ? 'Hoạt động' : 'Vô hiệu'}
            </Badge>
          </div>

          {category.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{category.description}</p>
            </div>
          )}

          {category.displayOrder !== undefined && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Thứ tự hiển thị</p>
              <p className="text-gray-900">{category.displayOrder ?? '-'}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Số nhóm icon</p>
            <p className="text-gray-900">{category.totalIconGroups ?? 0}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Số icon</p>
            <p className="text-gray-900">{category.totalIcons ?? 0}</p>
          </div>

          {category.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Ngày tạo</p>
              <p className="text-gray-900">
                {new Date(category.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
