import { z } from 'zod'

export const feedbackResponseSchema = z.object({
  responseContent: z
    .string()
    .min(1, 'Nội dung phản hồi không được để trống')
    .nullable(),
  filePublicIds: z.array(z.string()).nullable().optional(),
})

export type FeedbackResponseFormData = z.infer<typeof feedbackResponseSchema>

export const approveFeedbackResponseSchema = z.object({
  approvalNote: z
    .string()
    .max(500, 'Ghi chú phê duyệt không quá 500 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type ApproveFeedbackResponseFormData = z.infer<typeof approveFeedbackResponseSchema>

export const rejectFeedbackResponseSchema = z.object({
  rejectionNote: z
    .string()
    .min(1, 'Vui lòng nhập lý do từ chối')
    .max(500, 'Lý do từ chối không quá 500 ký tự')
    .nullable(),
})

export type RejectFeedbackResponseFormData = z.infer<typeof rejectFeedbackResponseSchema>

export const updateFeedbackResponseSchema = z.object({
  responseContent: z
    .string()
    .min(1, 'Nội dung phản hồi không được để trống')
    .nullable(),
  filePublicIds: z.array(z.string()).nullable().optional(),
})

export type UpdateFeedbackResponseFormData = z.infer<typeof updateFeedbackResponseSchema>
