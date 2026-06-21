export interface SupportGroupCategoryTableRow {
  publicId: string
  name: string
  description?: string
  createdAt?: string
  isActive?: boolean
}

export interface SupportGroupCategoryFormData {
  name: string
  description?: string
  isActive?: boolean
}

// Re-export generated types if needed
export type { SupportGroupCategoryDto } from '@/api/models'