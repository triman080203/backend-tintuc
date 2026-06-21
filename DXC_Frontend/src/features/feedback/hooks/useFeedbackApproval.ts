import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackApproval } from '@/api/endpoints/feedback-approval'
import type { ApproveFeedbackResponseDto, RejectFeedbackResponseDto } from '@/api/models'
import { toast } from 'sonner'

export const useApproveFeedbackResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ responseId, data }: { responseId: number; data: ApproveFeedbackResponseDto }) =>
      getFeedbackApproval().postApiZaloMiniAppAdminFeedbackResponsesResponseIdApprove(responseId, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Duyệt phản hồi thành công', {
          description: 'Phản hồi đã được duyệt và sẽ gửi cho người phản ánh',
        })
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({ queryKey: ['feedback-detail'] })
      }
    },
    onError: (error: Error) => {
      toast.error('Duyệt phản hồi thất bại', {
        description: error.message,
      })
    },
  })
}

export const useRejectFeedbackResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ responseId, data }: { responseId: number; data: RejectFeedbackResponseDto }) =>
      getFeedbackApproval().postApiZaloMiniAppAdminFeedbackResponsesResponseIdReject(responseId, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Từ chối phản hồi thành công', {
          description: 'Phản hồi đã bị từ chối',
        })
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({ queryKey: ['feedback-detail'] })
      }
    },
    onError: (error: Error) => {
      toast.error('Từ chối phản hồi thất bại', {
        description: error.message,
      })
    },
  })
}
