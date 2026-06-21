import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { HotelImageDto } from '@/api/models'
import { buildImageUrl } from '../utils/imageUrl'

interface ImageGalleryProps {
  images: HotelImageDto[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-50">
        <p>Không có ảnh để hiển thị</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
  };

  const closeLightbox = () => {
    setCurrentImageIndex(null);
    setIsFullscreen(false);
  };

  const goToPrevious = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      );
    }
 };

  const goToNext = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex(
        currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {images.map((image, index) => {
          const imageUrl = buildImageUrl(image.imageUrl)
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-md cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={image.caption || `Ảnh khách sạn ${index + 1}`}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Không có ảnh</span>
                </div>
              )}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{image.caption}</p>
                </div>
              )}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Ảnh chính
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {isFullscreen && currentImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            className="absolute left-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Trước"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            className="absolute right-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Sau"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {images[currentImageIndex]?.imageUrl ? (
              <img
                src={buildImageUrl(images[currentImageIndex].imageUrl) || undefined}
                alt={images[currentImageIndex].caption || `Ảnh khách sạn ${currentImageIndex + 1}`}
                className="max-h-[70vh] object-contain"
              />
            ) : (
              <div className="max-h-[70vh] bg-gray-800 flex items-center justify-center w-full">
                <span className="text-gray-300">Không thể tải ảnh</span>
              </div>
            )}

            <div className="mt-4 text-white text-center">
              <p className="font-medium">
                {images[currentImageIndex].caption || `Ảnh ${currentImageIndex + 1}`}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
          
          {/* Thumbnail navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto py-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 ${
                  idx === currentImageIndex ? 'border-white' : 'border-transparent'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                aria-label={`Ảnh ${idx + 1}`}
              >
                {image.imageUrl ? (
                  <img
                    src={buildImageUrl(image.imageUrl) || undefined}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-400">?</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};