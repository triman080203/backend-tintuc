export interface IconCategoryTableRow {
  publicId: string
  name: string
  description?: string | null
  displayOrder?: number
  isActive?: boolean
  createdAt?: string
  totalIconGroups?: number
  totalIcons?: number
}

export interface IconCategoryFormData {
  name: string
  description?: string | null
  displayOrder?: number
  isActive?: boolean
}

export type { IconCategoryDto } from '@/api/models'
