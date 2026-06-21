import { z } from 'zod'

export const tinTucCategoryFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên danh mục'),
  slug: z.string().min(1, 'Vui lòng nhập đường dẫn (slug)'),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type TinTucCategoryFormData = z.infer<typeof tinTucCategoryFormSchema>
