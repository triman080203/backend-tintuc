import { Phone, Mail, Globe, MapPin, Star } from 'lucide-react'
import type { HotelWithImagesDto } from '@/api/models'

interface HotelProfileProps {
  hotel: HotelWithImagesDto | null | undefined
}

export const HotelProfile = ({ hotel }: HotelProfileProps) => {
  if (!hotel) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotel.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{hotel.description}</p>
            </div>
          )}

          {hotel.address && (
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Địa chỉ</p>
                <p className="text-gray-900">{hotel.address}</p>
              </div>
            </div>
          )}

          {hotel.starRating && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Xếp hạng</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.floor(hotel.starRating) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-900">{hotel.starRating.toFixed(1)}/5</span>
              </div>
            </div>
          )}

          {hotel.operatingHours && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Giờ hoạt động</p>
              <p className="text-gray-900">{hotel.operatingHours}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          {hotel.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a href={`tel:${hotel.phoneNumber}`} className="text-blue-600 hover:underline">
                {hotel.phoneNumber}
              </a>
            </div>
          )}

          {hotel.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a href={`mailto:${hotel.email}`} className="text-blue-600 hover:underline">
                {hotel.email}
              </a>
            </div>
          )}

          {hotel.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {hotel.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Location Section */}
      {(hotel.latitude || hotel.longitude || hotel.vr360Link) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin vị trí</h3>
          <div className="space-y-4">
            {hotel.latitude && hotel.longitude && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Tọa độ</p>
                <p className="text-gray-900 font-mono">
                  {hotel.latitude.toFixed(6)}, {hotel.longitude.toFixed(6)}
                </p>
              </div>
            )}

            {hotel.vr360Link && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">VR 360°</p>
                <a
                  href={hotel.vr360Link}
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
      )}

      {/* Pricing Section */}
      {hotel.priceFrom && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Thông tin giá</h3>
          <p className="text-gray-900">
            Từ {hotel.priceFrom.toLocaleString()} {hotel.priceFromCurrency || 'VND'}
          </p>
        </div>
      )}

      {/* Status Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
        <span className={hotel.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {hotel.isActive ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      </div>
    </div>
  )
}

export default HotelProfile
