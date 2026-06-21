export interface HotlineCategoryTableRow {
  publicId: string
  name: string
  description?: string
  createdAt?: string
  thuTu?: number
}

export interface HotlineCategoryFormData {
  name: string
  description?: string
}

export type { HotlineCategoryDto } from '@/api/models'
