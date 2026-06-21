import { z } from 'zod'

export const tinTucSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(500, 'Tiêu đề không quá 500 ký tự'),
  summary: z
    .string()
    .max(1000, 'Tóm tắt không quá 1000 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
  content: z.string().min(1, 'Nội dung không được để trống'),
  thumbnailUrl: z
    .string()
    .max(500, 'URL ảnh đại diện không quá 500 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
  categoryId: z.number().min(1, 'Vui lòng chọn danh mục'),
  tags: z
    .string()
    .max(200, 'Thẻ (tags) không quá 200 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
  authorName: z
    .string()
    .max(100, 'Tên tác giả không quá 100 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
  attachmentPublicIds: z.array(z.string()).nullable().optional(),
})

export type TinTucFormData = z.infer<typeof tinTucSchema>

export const workflowTinTucSchema = z.object({
  actionCode: z.enum(['submit', 'approve', 'return', 'publish', 'archive']),
  note: z
    .string()
    .max(1000, 'Ghi chú không quá 1000 ký tự')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type WorkflowTinTucFormData = z.infer<typeof workflowTinTucSchema>
