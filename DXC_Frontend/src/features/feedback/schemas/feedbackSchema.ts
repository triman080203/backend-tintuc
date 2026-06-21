import { z } from 'zod'

export const feedbackSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(500, 'Tiêu đề không quá 500 ký tự'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(200, 'Họ tên không quá 200 ký tự'),
  phoneNumber: z
    .string()
    .max(20, 'Số điện thoại không quá 20 ký tự')
    .regex(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ')
    .nullable()
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(500, 'Địa điểm không quá 500 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
  isPublic: z.boolean(),
  attachmentPublicIds: z.array(z.string()).nullable().optional(),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

export const assignFeedbackSchema = z.object({
  feedbackPublicId: z.string().min(1, 'ID phản ánh không hợp lệ'),
  departmentPublicId: z.string().min(1, 'Vui lòng chọn phòng ban'),
  toStatusId: z.number().min(0, 'Trạng thái không hợp lệ'),
  processingNote: z
    .string()
    .max(1000, 'Ghi chú không quá 1000 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type AssignFeedbackFormData = z.infer<typeof assignFeedbackSchema>

export const processFeedbackSchema = z.object({
  feedbackPublicId: z.string().min(1, 'ID phản ánh không hợp lệ'),
  fromStatusId: z.number().min(1, 'Trạng thái hiện tại không hợp lệ'),
  toStatusId: z.number().min(1, 'Vui lòng chọn trạng thái mới'),
  processingNote: z
    .string()
    .max(1000, 'Ghi chú không quá 1000 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type ProcessFeedbackFormData = z.infer<typeof processFeedbackSchema>

export const rejectFeedbackSchema = z.object({
  feedbackPublicId: z.string().min(1, 'ID phản ánh không hợp lệ'),
  toStatusId: z.string().min(1, 'Trạng thái không hợp lệ'),
  rejectionReason: z
    .string()
    .min(1, 'Lý do từ chối không được để trống')
    .max(1000, 'Lý do từ chối không quá 1000 ký tự'),
})

export type RejectFeedbackFormData = z.infer<typeof rejectFeedbackSchema>
