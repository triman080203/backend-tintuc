import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { useNewsImageUpload } from '../hooks/useNewsImageUpload'
import { buildImageUrl } from '@/features/homestays/utils/imageUrl' // or a generic util if you have one

interface NewsImageUploaderProps {
  onImageUploaded: (publicId: string | null) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImageUrl?: string | null
  existingImagePublicId?: string | null
}

export function NewsImageUploader({
  onImageUploaded,
  disabled = false,
  onUploadingChange,
  existingImageUrl = null,
  existingImagePublicId = null,
}: NewsImageUploaderProps) {
  const { uploadedImages, isUploading, handleUpload, clearImages } = useNewsImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [removedExisting, setRemovedExisting] = useState(false)
  const lastSyncRef = useRef<string | null>(null)

  // Notify parent of upload state changes
  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  // Sync image to parent
  useEffect(() => {
    let currentPublicId: string | null = null;
    if (uploadedImages.length > 0) {
      // Get the last uploaded image if multiple were uploaded by accident
      currentPublicId = uploadedImages[uploadedImages.length - 1].publicId;
    } else if (existingImagePublicId && !removedExisting) {
      currentPublicId = existingImagePublicId;
    }

    if (currentPublicId !== lastSyncRef.current) {
      lastSyncRef.current = currentPublicId
      onImageUploaded(currentPublicId)
    }
  }, [uploadedImages, existingImagePublicId, removedExisting, onImageUploaded])

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Only take the first file
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      clearImages(); // clear previous uploaded if any
      setRemovedExisting(true);
      handleUpload(dt.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Only take the first file
      const dt = new DataTransfer();
      dt.items.add(e.target.files[0]);
      clearImages(); // clear previous
      setRemovedExisting(true);
      handleUpload(dt.files)
      e.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    clearImages();
    setRemovedExisting(true);
  }

  // Determine what image to show
  const currentUpload = uploadedImages.length > 0 ? uploadedImages[uploadedImages.length - 1] : null;
  const showExisting = existingImageUrl && !removedExisting && !currentUpload;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!currentUpload && !showExisting && (
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
            id="news-image-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <label
            htmlFor="news-image-input"
            className="flex flex-col items-center justify-center cursor-pointer gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Kéo và thả ảnh hoặc click để chọn ảnh bìa
            </p>
            <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB)</p>
          </label>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {/* Display Image Section */}
      {(currentUpload || showExisting) && !isUploading && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Ảnh bìa hiện tại</p>
          <div className="relative group w-full max-w-sm">
            {currentUpload ? (
              <img
                src={buildImageUrl(currentUpload.url)}
                alt={currentUpload.name}
                className="w-full h-48 object-cover rounded-md border-2 border-blue-200"
              />
            ) : showExisting && existingImageUrl ? (
              <img
                src={buildImageUrl(existingImageUrl)}
                alt="Ảnh bìa"
                className="w-full h-48 object-cover rounded-md border-2 border-green-200"
              />
            ) : null}

            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Xóa ảnh"
              disabled={disabled || isUploading}
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
