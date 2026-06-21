import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getFiles } from '@/api/endpoints/files'
import type { UploadFileResponseDto } from '@/api/models'
import { toast } from 'sonner'

interface UploadedImage {
  publicId: string
  name: string
  url: string
  uid: string
}

export const useHomestayImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (body: { files: File[] }) =>
      getFiles().postApiFilesUpload({
        ...body,
        entityType: 'Homestay',
      }),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const newImages: UploadedImage[] = result.data.map((file: UploadFileResponseDto) => ({
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
          uid: file.uid || file.publicId || `img-${Date.now()}-${Math.random()}`,
        }))
        setUploadedImages((prev) => [...prev, ...newImages])
        toast.success(`Đã tải lên ${newImages.length} ảnh thành công`)
      }
    },
    onError: (error: Error) => {
      toast.error('Tải lên ảnh thất bại', {
        description: error.message,
      })
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const fileArray = Array.from(files)

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const invalidFiles = fileArray.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast.error('Có ảnh vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 5MB. Ảnh lỗi: ${invalidFiles.map((f) => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    // Upload files
    uploadMutation.mutate({ files: fileArray })
  }

  const removeImage = (uid: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.uid !== uid))
  }

  const clearImages = () => {
    setUploadedImages([])
  }

  const getPublicIds = (): string[] => {
    return uploadedImages.map((img) => img.publicId)
  }

  return {
    uploadedImages,
    isUploading,
    handleUpload,
    removeImage,
    clearImages,
    getPublicIds,
  }
}