import React, { useState } from 'react'
import { Upload, X, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTourImageUpload } from '../hooks/useTourImageUpload'

export interface TourImage {
  publicId: string
  imageUrl: string
  imagePublicId: string
  displayOrder: number
  isPrimary: boolean
  caption?: string
}

interface TourImageUploaderProps {
  images: TourImage[]
  onChange: (images: TourImage[]) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
}

export const TourImageUploader = ({
  images,
  onChange,
  disabled,
  onUploadingChange,
}: TourImageUploaderProps) => {
  const uploadMutation = useTourImageUpload()

  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (disabled || uploadMutation.isPending) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files))
    }
    e.target.value = ''
  }

  const uploadFiles = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    onUploadingChange?.(true)
    const newImages = [...images]
    let currentOrder = Math.max(0, ...images.map(img => img.displayOrder)) + 1

    try {
      const res = await uploadMutation.mutateAsync(acceptedFiles)
      if (res.data) {
        res.data.forEach((uploadedFile) => {
          newImages.push({
            publicId: 'temp-' + Date.now() + Math.random(),
            imageUrl: uploadedFile.url || '',
            imagePublicId: uploadedFile.publicId || '',
            displayOrder: currentOrder++,
            isPrimary: newImages.length === 0, // First image is primary by default
          })
        })
      }
    } catch (error) {
      console.error('Upload failed')
    }

    onChange(newImages)
    onUploadingChange?.(false)
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove)
    // If we removed the primary image, make the first one primary
    if (images[indexToRemove].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    onChange(newImages)
  }

  const setPrimary = (indexToSet: number) => {
    const newImages = images.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToSet
    }))
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
        } ${disabled || uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          type="file"
          id="tour-image-input"
          className="hidden"
          multiple
          accept="image/*"
          disabled={disabled || uploadMutation.isPending}
          onChange={handleFileSelect}
        />
        <label
          htmlFor="tour-image-input"
          className={`flex flex-col items-center justify-center cursor-pointer gap-2 ${disabled || uploadMutation.isPending ? 'pointer-events-none' : ''}`}
        >
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Kéo thả ảnh vào đây, hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ PNG, JPG, JPEG, WEBP
            </p>
          </div>
        )}
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={img.publicId || idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
              <img
                src={img.imageUrl}
                alt="Tour image"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPrimary(idx)
                    }}
                  >
                    Làm ảnh bìa
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(idx)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {img.isPrimary && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> Ảnh bìa
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
