import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getFiles } from '@/api/endpoints/files'
import type { UploadFileResponseDto } from '@/api/models'
import { toast } from 'sonner'

export interface UploadedImage {
  publicId: string
  name: string
  url: string
  uid: string
  displayOrder: number
  isPrimary?: boolean
  caption?: string
}

export const useOcopProductImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (body: { files: File[] }) =>
      getFiles().postApiFilesUpload({
        ...body,
        entityType: 'OcopProduct',
      }),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const newImages: UploadedImage[] = result.data.map(
          (file: UploadFileResponseDto, index: number) => ({
            publicId: file.publicId || '',
            name: file.name || 'Unknown',
            url: file.url || '',
            uid: file.uid || file.publicId || `img-${Date.now()}-${Math.random()}`,
            displayOrder: uploadedImages.length + index,
          })
        )
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
      toast.error('Ảnh vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 5MB. Ảnh lỗi: ${invalidFiles.map((f) => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    uploadMutation.mutate({ files: fileArray })
  }

  const removeImage = (uid: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.uid !== uid))
  }

  const setPrimaryImage = (uid: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.uid === uid,
      }))
    )
  }

  const updateCaption = (uid: string, caption: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.uid === uid ? { ...img, caption } : img))
    )
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      const [removed] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, removed)
      return newImages.map((img, idx) => ({
        ...img,
        displayOrder: idx,
      }))
    })
  }

  const getPublicIds = (): string[] => {
    return uploadedImages.map((img) => img.publicId)
  }

  const clear = () => {
    setUploadedImages([])
  }

  return {
    uploadedImages,
    isUploading,
    handleUpload,
    removeImage,
    setPrimaryImage,
    updateCaption,
    reorderImages,
    getPublicIds,
    clear,
  }
}
