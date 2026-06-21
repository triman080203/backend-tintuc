import type { HotlineDto } from '@/api/models'

interface HotlineProfileProps {
  item: HotlineDto
}

export const HotlineProfile = ({ item }: HotlineProfileProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên liên hệ</h3>
          <p className="text-lg text-gray-900">{item.contactName || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Số điện thoại</h3>
          <p className="text-lg text-gray-900">{item.phoneNumber || '-'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Danh mục</h3>
        <p className="text-lg text-gray-900">{item.categoryName || '-'}</p>
      </div>

      {item.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
        </div>
      )}

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
        </div>

        {item.updatedAt && (
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Cập nhật lần cuối</h3>
            <p className="text-gray-600">{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HotlineProfile
