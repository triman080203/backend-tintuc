import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackAdmin } from '@/api/endpoints/feedback-admin'
import type { CreateFeedbackDto, UpdateFeedbackDto } from '@/api/models'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useCreateFeedback = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateFeedbackDto) =>
      getFeedbackAdmin().postApiZaloMiniAppAdminFeedbackCreate(data),
    onSuccess: result => {
      if (result.success && result.data) {
        toast.success('Tạo phản ánh thành công')
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        navigate(`/feedback/${result.data.publicId}`)
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo phản ánh thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateFeedbackDto) =>
      getFeedbackAdmin().postApiZaloMiniAppAdminFeedbackUpdate(data),
    onSuccess: result => {
      if (result.success && result.data) {
        toast.success('Cập nhật phản ánh thành công')
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({ queryKey: ['feedback-detail', result.data.publicId] })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật phản ánh thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (publicId: string) =>
      getFeedbackAdmin().postApiZaloMiniAppAdminFeedbackDelete({ publicId }),
    onSuccess: (result, publicId) => {
      if (result.success) {
        toast.success('Xóa phản ánh thành công')
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.removeQueries({ queryKey: ['feedback-detail', publicId] })
        navigate('/feedback')
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa phản ánh thất bại', {
        description: error.message,
      })
    },
  })
}
