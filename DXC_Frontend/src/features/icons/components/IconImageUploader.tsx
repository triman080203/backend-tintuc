import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { useIconImageUpload } from '../hooks/useIconImageUpload'
import { buildImageUrl } from '../utils/imageUrl'

interface IconImageUploaderProps {
  onImagesUploaded: (publicIds: string[]) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImage?: string | null
}

export function IconImageUploader({
  onImagesUploaded,
  disabled = false,
  onUploadingChange,
  existingImage,
}: IconImageUploaderProps) {
  const { uploadedImages, isUploading, handleUpload, removeImage } = useIconImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [removedExisting, setRemovedExisting] = useState(false)
  const lastSyncRef = useRef<string>('')

  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  useEffect(() => {
    const allPublicIds = [...uploadedImages.map((img) => img.publicId).filter(Boolean)]

    if (existingImage && !removedExisting) {
      allPublicIds.unshift(existingImage)
    }

    const currentSync = JSON.stringify(allPublicIds)

    if (currentSync !== lastSyncRef.current) {
      lastSyncRef.current = currentSync
      onImagesUploaded(allPublicIds)
    }
  }, [uploadedImages, existingImage, removedExisting, onImagesUploaded])

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
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
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
          id="icon-image-input"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="icon-image-input"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Kéo và thả ảnh hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB mỗi ảnh)</p>
        </label>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {/* Existing Image */}
      {existingImage && !removedExisting && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Ảnh hiện tại</p>
          <div className="w-32 h-32">
            <img
              src={buildImageUrl(existingImage) || ''}
              alt="Current icon"
              className="w-full h-full object-contain rounded-md border-2 border-green-200"
            />
          </div>
          <button
            type="button"
            onClick={() => setRemovedExisting(true)}
            className="bg-red-500 text-white rounded-md px-2 py-1"
            disabled={disabled || isUploading}
            title="Xóa ảnh hiện tại"
          >
            <span className="inline-flex items-center gap-1"><Trash2 className="w-4 h-4" /> Xóa ảnh</span>
          </button>
        </div>
      )}

      {/* New Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Ảnh mới tải lên ({uploadedImages.length})
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
                      className="w-full h-24 object-contain rounded-md border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md border-2 border-blue-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(image.uid)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa ảnh"
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
