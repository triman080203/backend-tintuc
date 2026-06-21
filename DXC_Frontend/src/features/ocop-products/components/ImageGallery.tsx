import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { OcopProductImageDto } from '@/api/models'
import { buildImageUrl } from '../utils/imageUrl'

interface ImageGalleryProps {
  images: OcopProductImageDto[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentImage = images[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!images.length) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.publicId}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => {
              setCurrentIndex(idx)
              setIsOpen(true)
            }}
          >
            <img
              src={buildImageUrl(img.imageUrl)}
              alt={img.caption || `Image ${idx + 1}`}
              className="h-full w-full object-cover hover:scale-105 transition-transform"
            />
            {img.isPrimary && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Chính
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') handlePrev()
            if (e.key === 'ArrowRight') handleNext()
            if (e.key === 'Escape') setIsOpen(false)
          }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:bg-gray-700 p-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-gray-700 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh]">
            <img
              src={buildImageUrl(currentImage.imageUrl)}
              alt={currentImage.caption || `Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-gray-700 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
