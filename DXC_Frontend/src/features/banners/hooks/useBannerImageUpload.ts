import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getFiles } from '@/api/endpoints/files'
import { toast } from 'sonner'

interface UploadedImage {
  publicId: string
  name: string
  url: string
}

export const useBannerImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (body: { files: File[] }) =>
      getFiles().postApiFilesUpload({
        ...body,
        entityType: 'Banner',
      }),
    onSuccess: (result) => {
      if (result.success && result.data && result.data.length > 0) {
        const file = result.data[0]
        const newImage: UploadedImage = {
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
        }
        setUploadedImage(newImage)
        toast.success('Tải lên ảnh thành công')
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
    const maxSize = 5 * 1024 * 1024
    const invalidFiles = fileArray.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast.error('Ảnh vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 5MB. Ảnh lỗi: ${invalidFiles.map((f) => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    uploadMutation.mutate({ files: [fileArray[0]] })
  }

  const clearImage = () => {
    setUploadedImage(null)
  }

  const getPublicId = (): string | null => {
    return uploadedImage?.publicId || null
  }

  return {
    uploadedImage,
    isUploading,
    handleUpload,
    clearImage,
    getPublicId,
  }
}
