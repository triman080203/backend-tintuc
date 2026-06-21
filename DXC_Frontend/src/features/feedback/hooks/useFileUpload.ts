import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getFiles } from '@/api/endpoints/files'
import type { PostApiFilesUploadBody, UploadFileResponseDto } from '@/api/models'
import { toast } from 'sonner'

interface UploadedFile {
  publicId: string
  name: string
  url: string
  uid: string
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (body: PostApiFilesUploadBody) => getFiles().postApiFilesUpload(body),
    onSuccess: result => {
      if (result.success && result.data) {
        const newFiles: UploadedFile[] = result.data.map((file: UploadFileResponseDto) => ({
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
          uid: file.uid || file.publicId || '',
        }))
        setUploadedFiles(prev => [...prev, ...newFiles])
        toast.success(`Đã tải lên ${newFiles.length} tệp thành công`)
      }
    },
    onError: (error: Error) => {
      toast.error('Tải lên thất bại', {
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

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const invalidFiles = fileArray.filter(file => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast.error('Có tệp vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 10MB. Tệp lỗi: ${invalidFiles.map(f => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    // Upload files
    uploadMutation.mutate({
      files: fileArray as Blob[],
      entityType: 'Feedback', // Optional: specify entity type
    })
  }

  const removeFile = (uid: string) => {
    setUploadedFiles(prev => prev.filter(file => file.uid !== uid))
  }

  const clearFiles = () => {
    setUploadedFiles([])
  }

  const getPublicIds = (): string[] => {
    return uploadedFiles.map(file => file.publicId)
  }

  return {
    uploadedFiles,
    isUploading,
    handleUpload,
    removeFile,
    clearFiles,
    getPublicIds,
  }
}
