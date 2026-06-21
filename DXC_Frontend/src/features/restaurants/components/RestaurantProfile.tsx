import type { RestaurantDto } from '@/api/models'

interface RestaurantProfileProps {
  restaurant: RestaurantDto | null | undefined
}

export const RestaurantProfile = ({ restaurant }: RestaurantProfileProps) => {
  if (!restaurant) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tên</p>
            <p className="text-gray-900">{restaurant.name || '-'}</p>
          </div>

          {restaurant.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{restaurant.description}</p>
            </div>
          )}

          {restaurant.address && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Địa chỉ</p>
              <p className="text-gray-900">{restaurant.address}</p>
            </div>
          )}

          {restaurant.operatingHours && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Giờ hoạt động</p>
              <p className="text-gray-900">{restaurant.operatingHours}</p>
            </div>
          )}

          {restaurant.schedule && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Lịch hoạt động</p>
              <p className="text-gray-900">{restaurant.schedule}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin liên hệ</h3>
        <div className="space-y-3">
          {restaurant.phoneNumber && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Điện thoại</p>
              <a href={`tel:${restaurant.phoneNumber}`} className="text-blue-600 hover:underline">
                {restaurant.phoneNumber}
              </a>
            </div>
          )}

          {restaurant.vR360Link && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">VR 360°</p>
              <a
                href={restaurant.vR360Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                Xem VR 360°
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Location Section */}
      {(restaurant.latitude || restaurant.longitude) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin vị trí</h3>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Tọa độ</p>
            <p className="text-gray-900 font-mono">
              {restaurant.latitude?.toFixed(6)}, {restaurant.longitude?.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Category & Pricing Section */}
      {(restaurant.category || restaurant.averagePriceRange) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Danh mục & Giá</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurant.category && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Danh mục</p>
                <p className="text-gray-900">{restaurant.category}</p>
              </div>
            )}

            {restaurant.averagePriceRange && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Mức giá trung bình</p>
                <p className="text-gray-900">{restaurant.averagePriceRange}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
        <span className={restaurant.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {restaurant.isActive ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      </div>
    </div>
  )
}

export default RestaurantProfile
