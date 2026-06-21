import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { useBannerImageUpload } from '../hooks/useBannerImageUpload'
import { buildImageUrl } from '../utils/imageUrl'
import { getFiles } from '@/api/endpoints/files'

interface BannerImageUploaderProps {
  onImageUploaded: (publicId: string | null) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImagePublicId?: string | null
}

export function BannerImageUploader({
  onImageUploaded,
  disabled = false,
  onUploadingChange,
  existingImagePublicId,
}: BannerImageUploaderProps) {
  const { uploadedImage, isUploading, handleUpload, clearImage } = useBannerImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [removedExisting, setRemovedExisting] = useState(false)
  const [existingBlobUrl, setExistingBlobUrl] = useState<string | null>(null)
  const lastSyncRef = useRef<string>('')

  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  useEffect(() => {
    const publicId =
      uploadedImage?.publicId ??
      (existingImagePublicId && !removedExisting ? existingImagePublicId : null)
    const currentSync = JSON.stringify(publicId)
    if (currentSync !== lastSyncRef.current) {
      lastSyncRef.current = currentSync
      onImageUploaded(publicId)
    }
  }, [uploadedImage, existingImagePublicId, removedExisting, onImageUploaded])

  useEffect(() => {
    if (uploadedImage) {
      setRemovedExisting(false)
    }
  }, [uploadedImage])

  useEffect(() => {
    let active = true
    let currentUrl: string | null = null
    setExistingBlobUrl(null)
    if (existingImagePublicId && !uploadedImage && !removedExisting) {
      getFiles()
        .getApiFilesPublicId(existingImagePublicId)
        .then((blob) => {
          if (!active) return
          const url = URL.createObjectURL(blob)
          currentUrl = url
          setExistingBlobUrl(url)
        })
        .catch(() => {
          setExistingBlobUrl(null)
        })
    }
    return () => {
      active = false
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [existingImagePublicId, uploadedImage, removedExisting])

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

  const handleClear = () => {
    if (uploadedImage) {
      clearImage()
      onImageUploaded(null)
      return
    }

    if (existingImagePublicId) {
      setRemovedExisting(true)
      onImageUploaded(null)
    }
  }

  const displayImageUrl = removedExisting
    ? null
    : uploadedImage
      ? buildImageUrl(uploadedImage.url)
      : existingBlobUrl

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
          id="banner-image-input"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="banner-image-input"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Kéo và thả ảnh hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB)</p>
        </label>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {/* Current Image Display */}
      {displayImageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {uploadedImage ? 'Ảnh mới' : 'Ảnh hiện tại'}
          </p>
          <div className="relative inline-block">
            <img
              src={displayImageUrl}
              alt="Banner"
              className={`max-w-sm h-32 object-cover rounded-md border-2 ${
                uploadedImage ? 'border-blue-200' : 'border-green-200'
              }`}
            />
            <button
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
              title="Xóa ảnh"
              disabled={disabled || isUploading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {uploadedImage && (
            <p className="text-xs text-gray-600">{uploadedImage.name}</p>
          )}
        </div>
      )}

      {/* No Image State */}
      {!displayImageUrl && (
        <div className="text-center py-4 text-gray-500 text-sm">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          Chưa có ảnh
        </div>
      )}
    </div>
  )
}
