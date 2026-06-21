import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { useHotelImageUpload } from '../hooks/useHotelImageUpload'
import { buildImageUrl } from '../utils/imageUrl'
import type { HotelImageDto } from '@/api/models'

interface HotelImageUploaderProps {
  onImagesUploaded: (publicIds: string[]) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImages?: HotelImageDto[]
}

export function HotelImageUploader({
  onImagesUploaded,
  disabled = false,
  onUploadingChange,
  existingImages = [],
}: HotelImageUploaderProps) {
  const { uploadedImages, isUploading, handleUpload, removeImage } = useHotelImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [removedExisting, setRemovedExisting] = useState<Set<string>>(new Set())
  const lastSyncRef = useRef<string>('')

  // Notify parent when upload state changes
  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  // Sync images to parent when uploaded images change
  useEffect(() => {
    const filteredExisting = existingImages
      .map((img) => img.imagePublicId)
      .filter((id): id is string => !!id && !removedExisting.has(id))

    const allPublicIds = [
      ...filteredExisting,
      ...uploadedImages.map((img) => img.publicId),
    ]
    const currentSync = JSON.stringify(allPublicIds)
    
    // Only call callback if the IDs actually changed
    if (currentSync !== lastSyncRef.current) {
      lastSyncRef.current = currentSync
      onImagesUploaded(allPublicIds)
    }
  }, [uploadedImages, existingImages, removedExisting, onImagesUploaded])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files)
      // Reset input để có thể upload cùng file lại
      e.target.value = ''
    }
  }

  const removeExistingImage = (publicId?: string) => {
    if (!publicId) return
    setRemovedExisting(prev => {
      const next = new Set(prev)
      next.add(publicId)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
        } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          id="hotel-image-input"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="hotel-image-input"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Kéo và thả ảnh hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB mỗi ảnh)</p>
        </label>
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Ảnh hiện tại ({existingImages.filter(img => !removedExisting.has(img.imagePublicId || '')).length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.filter(img => !removedExisting.has(img.imagePublicId || '')).map((image, index) => {
              const imageUrl = buildImageUrl(image.imageUrl)
              return (
                <div key={`existing-${image.publicId || index}`} className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.caption || `Hotel image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md border-2 border-green-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Chính
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.imagePublicId)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={disabled || isUploading}
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.caption || image.imageUrl || 'Ảnh'}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Ảnh mới thêm ({uploadedImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image) => {
              const imageUrl = buildImageUrl(image.url)
              return (
                <div key={image.uid} className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-md border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md border-2 border-blue-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(image.uid)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={disabled}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
