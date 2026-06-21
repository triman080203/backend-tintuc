import type { OcopProductCategoryDto } from '@/api/models'

interface OcopCategoryProfileProps {
  category: OcopProductCategoryDto | null | undefined
}

export const OcopCategoryProfile = ({ category }: OcopCategoryProfileProps) => {
  if (!category) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên danh mục</h3>
          <p className="text-lg text-gray-900">{category.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Thứ tự hiển thị</h3>
          <p className="text-lg text-gray-900">{category.displayOrder || '-'}</p>
        </div>
      </div>

      {category.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{category.description}</p>
        </div>
      )}


      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Trạng thái</h3>
          <p className="text-gray-600">
            {category.isActive ? (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                Hoạt động
              </span>
            ) : (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                Không hoạt động
              </span>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">
            {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : '-'}
          </p>
        </div>

       
      </div>
    </div>
  )
}

export default OcopCategoryProfile
