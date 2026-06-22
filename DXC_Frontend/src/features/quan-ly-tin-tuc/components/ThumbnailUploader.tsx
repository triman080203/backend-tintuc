import React, { useState, useRef } from 'react'
import { Upload, X, Image, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { customRequest } from '@/api/request'

interface ThumbnailUploaderProps {
  value?: string | null
  onChange: (url: string) => void
  disabled?: boolean
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh (jpg, png, webp...)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('entityType', 'TinTucThumbnail')

      const res = await customRequest<{ success: boolean; data: Array<{ url: string }> }>({
        url: '/api/files/upload',
        method: 'POST',
        data: formData,
        // Không set Content-Type để axios tự set multipart/form-data với boundary
      })

      if (res.success && res.data?.[0]?.url) {
        onChange(res.data[0].url)
        toast.success('Upload ảnh thành công')
      } else {
        toast.error('Upload ảnh thất bại')
      }
    } catch {
      toast.error('Có lỗi xảy ra khi upload ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    // Reset input để có thể chọn lại cùng file
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      {value ? (
        // Preview mode
        <div className="relative group w-full max-w-sm rounded-xl overflow-hidden border border-border shadow-sm">
          <img
            src={value}
            alt="Thumbnail preview"
            className="w-full aspect-video object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => !disabled && inputRef.current?.click()}
              className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center gap-1.5"
              disabled={disabled}
            >
              <Upload className="w-4 h-4" />
              Thay ảnh
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 flex items-center gap-1.5"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        // Upload dropzone
        <div
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'}
            ${disabled || isUploading ? 'cursor-not-allowed opacity-60' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-sm font-medium">Đang upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Kéo thả hoặc nhấp để chọn ảnh</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP · Tối đa 5MB</p>
                <p className="text-xs text-muted-foreground">Tỉ lệ 16:9 khuyến nghị</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  )
}
