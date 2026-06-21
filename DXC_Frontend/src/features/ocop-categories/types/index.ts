export interface OcopCategoryTableRow {
  publicId: string
  name: string
  description?: string | null
  imageUrl?: string | null
  displayOrder?: number
  isActive?: boolean
  createdAt: string
}

export interface OcopCategoryFormData {
  name: string
  description?: string
  imageUrl?: string
  displayOrder?: number
}

export type { OcopProductCategoryDto } from '@/api/models'
