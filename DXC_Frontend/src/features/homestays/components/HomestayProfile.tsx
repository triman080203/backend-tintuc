import { formatDate } from '@/shared/utils/date'
import { ImageGallery } from './ImageGallery'
import type { HomestayDto } from '@/api/models'

interface HomestayProfileProps {
  item: HomestayDto
}

export const HomestayProfile = ({ item }: HomestayProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Name and Address Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên homestay</h3>
          <p className="text-lg text-gray-900">{item.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Địa chỉ</h3>
          <p className="text-lg text-gray-900">{item.address || '-'}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Số điện thoại</h3>
          <p className="text-gray-900">{item.phoneNumber || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tọa độ</h3>
          <p className="text-gray-900">
            {item.latitude && item.longitude 
              ? `${item.latitude}, ${item.longitude}`
              : '-'
            }
          </p>
        </div>
      </div>

      {/* Description Section */}
      {item.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
        </div>
      )}

      {/* Website and Location Link Section */}
      {(item.website || item.linkVitri) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.website && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Website</h3>
              <a
                href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {item.website}
              </a>
            </div>
          )}

          {item.linkVitri && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Link vị trí</h3>
              <a
                href={item.linkVitri.startsWith('http') ? item.linkVitri : `https://${item.linkVitri}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {item.linkVitri}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Pricing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Giá trung bình</h3>
          <p className="text-gray-900">
            {item.averagePrice 
              ? `${item.averagePrice.toLocaleString()} ${item.averagePriceCurrency || 'VND'}`
              : '-'
            }
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
          <p className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            item.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
          </p>
        </div>
      </div>

      {/* Images Section */}
      {item.images && item.images.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Hình ảnh homestay</h3>
          <ImageGallery images={item.images} />
        </div>
      )}

      {/* Metadata Section */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">{formatDate(item.createdAt)}</p>
        </div>

        {item.updatedAt && (
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Cập nhật lần cuối</h3>
            <p className="text-gray-600">{formatDate(item.updatedAt)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomestayProfile