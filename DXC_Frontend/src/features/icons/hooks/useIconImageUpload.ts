import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getFiles } from '@/api/endpoints/files'
import type { ApiResultOfListUploadFileResponseDto, UploadFileResponseDto } from '@/api/models'

interface UploadedImage {
  publicId: string
  name: string
  url: string
  uid: string
}

const api = getFiles()

export const useIconImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      formData.append('entityType', 'Icon')

      return api.postApiFilesUpload({
        files,
        entityType: 'Icon',
      })
    },
    onSuccess: (result: ApiResultOfListUploadFileResponseDto) => {
      if (result && result.data) {
        const newImages: UploadedImage[] = result.data.map((file: UploadFileResponseDto) => ({
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
          uid: file.publicId || `img-${Date.now()}-${Math.random()}`,
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

    const maxSize = 5 * 1024 * 1024
    const invalidFiles = fileArray.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast.error('Có ảnh vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 5MB. Ảnh lỗi: ${invalidFiles.map((f) => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    uploadMutation.mutate(fileArray)
  }

  const removeImage = (uid: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.uid !== uid))
  }

  const clearImages = () => {
    setUploadedImages([])
  }

  const getPublicIds = (): string[] => {
    return uploadedImages.map((img) => img.publicId).filter(Boolean)
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
