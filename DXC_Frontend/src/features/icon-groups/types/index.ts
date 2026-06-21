export interface IconGroupTableRow {
  publicId: string
  name: string
  iconCategoryName?: string | null
  description?: string | null
  displayOrder?: number
  isActive?: boolean
  createdAt?: string
  totalIcons?: number
}

export interface IconGroupFormData {
  iconCategoryPublicId: string
  name: string
  description?: string | null
  displayOrder?: number
  isActive?: boolean
}

export type { IconGroupDto } from '@/api/models'
