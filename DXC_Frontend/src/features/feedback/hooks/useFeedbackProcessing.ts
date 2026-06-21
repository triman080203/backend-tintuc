import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackProcessing } from '@/api/endpoints/feedback-processing'
import type {
  AssignFeedbackDto,
  ProcessFeedbackDto,
  CreateFeedbackResponseDto,
  UpdateFeedbackResponseDto,
} from '@/api/models'
import { toast } from 'sonner'

export const useAssignFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignFeedbackDto) =>
      getFeedbackProcessing().postApiZaloMiniAppAdminFeedbackAssign(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Điều phối phản ánh thành công', {
          description: 'Phản ánh đã được chuyển cho phòng ban xử lý',
        })
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({
          queryKey: ['feedback-detail', variables.feedbackPublicId],
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Điều phối phản ánh thất bại', {
        description: error.message,
      })
    },
  })
}

export const useProcessFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProcessFeedbackDto) =>
      getFeedbackProcessing().postApiZaloMiniAppAdminFeedbackProcess(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật trạng thái thành công')
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({
          queryKey: ['feedback-detail', variables.feedbackPublicId],
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật trạng thái thất bại', {
        description: error.message,
      })
    },
  })
}

export const useCreateFeedbackResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      feedbackPublicId,
      data,
    }: {
      feedbackPublicId: string
      data: CreateFeedbackResponseDto
    }) =>
      getFeedbackProcessing().postApiZaloMiniAppAdminFeedbackFeedbackPublicIdResponse(
        feedbackPublicId,
        data
      ),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Tạo phản hồi thành công', {
          description: 'Phản hồi đã được gửi và chờ phê duyệt',
        })
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({
          queryKey: ['feedback-detail', variables.feedbackPublicId],
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo phản hồi thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateFeedbackResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      responseId,
      data,
    }: {
      responseId: number
      data: UpdateFeedbackResponseDto
    }) =>
      getFeedbackProcessing().postApiZaloMiniAppAdminFeedbackResponseResponseIdUpdate(
        responseId,
        data
      ),
    onSuccess: result => {
      if (result.success) {
        toast.success('Cập nhật phản hồi thành công')
        queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
        queryClient.invalidateQueries({ queryKey: ['feedback-detail'] })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật phản hồi thất bại', {
        description: error.message,
      })
    },
  })
}
