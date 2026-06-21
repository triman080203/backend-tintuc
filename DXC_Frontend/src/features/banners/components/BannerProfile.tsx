import { Globe } from 'lucide-react'
import type { BannerDto } from '@/api/models'
import { BannerImageDisplay } from './BannerImageDisplay'

interface BannerProfileProps {
  banner: BannerDto | null | undefined
}

export const BannerProfile = ({ banner }: BannerProfileProps) => {
  if (!banner) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banner.title && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Tiêu đề</p>
              <p className="text-gray-900">{banner.title}</p>
            </div>
          )}

          {banner.position && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Vị trí</p>
              <p className="text-gray-900">{banner.position}</p>
            </div>
          )}

          {banner.bannerType && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Loại banner</p>
              <p className="text-gray-900">{banner.bannerType}</p>
            </div>
          )}

          {banner.nativeParams && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Tham số Native</p>
              <p className="text-gray-900 font-mono text-sm">{banner.nativeParams}</p>
            </div>
          )}
        </div>
      </div>

      {/* Link Section */}
      {banner.webLink && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Đường dẫn</h3>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <a
              href={banner.webLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {banner.webLink}
            </a>
          </div>
        </div>
      )}

      {/* Image Section */}
      {banner.imagePublicId && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Ảnh Banner</h3>
          <BannerImageDisplay
            imagePublicId={banner.imagePublicId}
            alt={banner.title || 'Banner'}
            className="w-full max-w-xl h-48 object-cover rounded-md border border-gray-200"
          />
        </div>
      )}

      {/* Status Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
        <span className={banner.isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {banner.isActive ? 'Hoạt động' : 'Vô hiệu'}
        </span>
      </div>

      {/* Timestamps Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin thời gian</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banner.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Ngày tạo</p>
              <p className="text-gray-900">{new Date(banner.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          )}

          {banner.updatedAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Ngày cập nhật</p>
              <p className="text-gray-900">{new Date(banner.updatedAt).toLocaleString('vi-VN')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
