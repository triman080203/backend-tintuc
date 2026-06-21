import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { PostApiFilesUploadBody } from '@/api/models'
import { toast } from 'sonner'

export interface UploadedFile {
  publicId: string
  name: string
  url: string
  uid: string
  size?: number
  type?: string
}

export interface UseFileUploadOptions {
  maxSize?: number // bytes
  maxCount?: number
  allowedTypes?: string[] // mimetypes or file extensions
  entityType?: string
  onSuccess?: (files: UploadedFile[]) => void
  onError?: (error: Error) => void
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxCount,
    allowedTypes = [],
    entityType,
    onSuccess,
    onError,
  } = options || {}

  const uploadMutation = useMutation({
    mutationFn: async (_body: PostApiFilesUploadBody) => {
      return { success: true, data: [] }
    },
    onSuccess: (result: any) => {
      if (result.success && result.data) {
        const newFiles: UploadedFile[] = result.data.map((file: any) => ({
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
          uid: file.uid || file.publicId || '',
          size: file.size,
        }))
        setUploadedFiles((prev) => [...prev, ...newFiles])
        toast.success(`Đã tải lên ${newFiles.length} tệp thành công`)
        onSuccess?.(newFiles)
      }
    },
    onError: (error: Error) => {
      toast.error('Tải lên thất bại', {
        description: error.message,
      })
      onError?.(error)
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  const validateFiles = useCallback(
    (files: FileList | File[]): { valid: File[]; errors: string[] } => {
      const fileArray = Array.from(files)
      const errors: string[] = []
      const validFiles: File[] = []

      // Check max count
      if (maxCount && uploadedFiles.length + fileArray.length > maxCount) {
        errors.push(`Tối đa ${maxCount} tệp được cho phép`)
        return { valid: [], errors }
      }

      for (const file of fileArray) {
        // Check file size
        if (file.size > maxSize) {
          errors.push(
            `${file.name} vượt quá kích thước cho phép (${(maxSize / (1024 * 1024)).toFixed(1)}MB)`
          )
          continue
        }

        // Check file type
        if (allowedTypes.length > 0) {
          const ext = file.name.split('.').pop()?.toLowerCase()
          const mimeType = file.type
          const isAllowed =
            allowedTypes.some((type) => mimeType.startsWith(type)) ||
            (ext && allowedTypes.includes(`.${ext}`))

          if (!isAllowed) {
            errors.push(`${file.name} không phải loại tệp được cho phép`)
            continue
          }
        }

        validFiles.push(file)
      }

      return { valid: validFiles, errors }
    },
    [uploadedFiles.length, maxCount, maxSize, allowedTypes]
  )

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return

      const { valid, errors } = validateFiles(files)

      if (errors.length > 0) {
        toast.error('Có tệp không hợp lệ', {
          description: errors.join('; '),
        })
        return
      }

      if (valid.length === 0) return

      setIsUploading(true)

      uploadMutation.mutate({
        files: valid as Blob[],
        entityType,
      })
    },
    [validateFiles, uploadMutation, entityType]
  )

  const removeFile = useCallback((uid: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.uid !== uid))
  }, [])

  const clearFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  const getPublicIds = useCallback((): string[] => {
    return uploadedFiles.map((file) => file.publicId)
  }, [uploadedFiles])

  const getFiles = useCallback((): UploadedFile[] => {
    return uploadedFiles
  }, [uploadedFiles])

  return {
    uploadedFiles,
    isUploading,
    handleUpload,
    removeFile,
    clearFiles,
    getPublicIds,
    getFiles,
    validateFiles,
  }
}
