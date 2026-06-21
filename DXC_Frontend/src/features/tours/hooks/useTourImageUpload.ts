import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getFiles } from '@/api/endpoints/files'

export const useTourImageUpload = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      try {
        const response = await getFiles().postApiFilesUpload({
          files,
          entityType: 'Tour'
        })
        return response
      } catch (error) {
        throw new Error('Không thể upload ảnh')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi upload ảnh')
    }
  })
}
