import { useFileUpload, type UploadedFile } from './useFileUpload'

interface UseImageUploadOptions {
  maxSize?: number // bytes, default 5MB
  maxCount?: number
  onSuccess?: (files: UploadedFile[]) => void
  onError?: (error: Error) => void
}

export const useImageUpload = (options?: UseImageUploadOptions) => {
  return useFileUpload({
    maxSize: options?.maxSize || 5 * 1024 * 1024, // 5MB default for images
    maxCount: options?.maxCount,
    allowedTypes: ['image/'], // Allow all image types
    entityType: 'Image',
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
