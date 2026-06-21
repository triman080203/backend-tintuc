import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { useOcopCategoryImageUpload } from '../hooks/useOcopCategoryImageUpload'
import { buildImageUrl } from '../utils/imageUrl'
import type { OcopProductCategoryDto } from '@/api/models'

interface OcopCategoryImageUploaderProps {
  onImageUploaded: (publicId: string | null) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImage?: OcopProductCategoryDto
}

export function OcopCategoryImageUploader({
  onImageUploaded,
  disabled = false,
  onUploadingChange,
  existingImage,
}: OcopCategoryImageUploaderProps) {
  const { uploadedImage, isUploading, handleUpload, removeImage } = useOcopCategoryImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [removedExisting, setRemovedExisting] = useState(false)
  const lastSyncRef = useRef<string>('')

  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  useEffect(() => {
    const currentPublicId = uploadedImage?.publicId || null
    const currentSync = JSON.stringify(currentPublicId)

    if (currentSync !== lastSyncRef.current) {
      lastSyncRef.current = currentSync
      onImageUploaded(currentPublicId)
    }
  }, [uploadedImage, onImageUploaded])

  useEffect(() => {
    if (uploadedImage) {
      setRemovedExisting(false)
    }
  }, [uploadedImage])

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

  const handleRemoveExisting = () => {
    setRemovedExisting(true)
    onImageUploaded('00000000-0000-0000-0000-000000000000')
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
          id="ocop-category-image-input"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="ocop-category-image-input"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Kéo và thả ảnh hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB)</p>
        </label>
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {existingImage?.imageUrl && !uploadedImage && !removedExisting && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Ảnh hiện tại</p>
          <div className="relative group">
            <img
              src={buildImageUrl(existingImage.imageUrl) || undefined}
              alt={existingImage.name || 'Category image'}
              className="w-full h-48 object-cover rounded-md border-2 border-green-200"
            />
            <button
              onClick={handleRemoveExisting}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Xóa ảnh hiện tại"
              type="button"
              disabled={disabled || isUploading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-600 mt-1 truncate">
              {existingImage.name || 'Ảnh danh mục'}
            </p>
          </div>
        </div>
      )}

      {uploadedImage && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Ảnh mới thêm</p>
          <div className="relative group">
            {buildImageUrl(uploadedImage.url) ? (
              <img
                src={buildImageUrl(uploadedImage.url) || undefined}
                alt={uploadedImage.name}
                className="w-full h-48 object-cover rounded-md border-2 border-blue-200"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-md border-2 border-blue-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <button
              onClick={() => removeImage()}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Xóa ảnh"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-600 mt-1 truncate">{uploadedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OcopCategoryImageUploader
