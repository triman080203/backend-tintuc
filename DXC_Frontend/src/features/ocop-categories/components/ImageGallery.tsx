import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { OcopProductCategoryDto } from '@/api/models'
import { buildImageUrl } from '../utils/imageUrl'

interface ImageGalleryProps {
  category: OcopProductCategoryDto
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ category }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!category?.imageUrl) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Không có ảnh để hiển thị</p>
      </div>
    )
  }

  const imageUrl = buildImageUrl(category.imageUrl)

  const closeLightbox = () => {
    setIsFullscreen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-md cursor-pointer group"
        onClick={() => setIsFullscreen(true)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name || 'Category image'}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-500">Không có ảnh</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 font-medium">
            Click để xem toàn màn hình
          </span>
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={category.name || 'Category image'}
                className="max-h-[80vh] object-contain"
              />
            ) : (
              <div className="max-h-[80vh] bg-gray-800 flex items-center justify-center w-full rounded">
                <span className="text-gray-300">Không thể tải ảnh</span>
              </div>
            )}

            <div className="mt-4 text-white text-center">
              <p className="font-medium">{category.name || 'Ảnh danh mục'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
