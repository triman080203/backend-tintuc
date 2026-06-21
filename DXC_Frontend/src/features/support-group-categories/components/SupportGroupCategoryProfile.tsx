import type { SupportGroupCategoryDto } from '@/api/models'

interface SupportGroupCategoryProfileProps {
  category: SupportGroupCategoryDto | null | undefined
}

export const SupportGroupCategoryProfile = ({ category }: SupportGroupCategoryProfileProps) => {
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>

          {category.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{category.description}</p>
            </div>
          )}

          {category.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Ngày tạo</p>
              <p className="text-gray-900">
                {new Date(category.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}

          {category.updatedAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Cập nhật lần cuối</p>
              <p className="text-gray-900">
                {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}