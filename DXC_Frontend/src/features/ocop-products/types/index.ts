export interface OcopProductTableRow {
  publicId: string
  name: string
  categoryName?: string | null
  enterpriseName?: string | null
  referencePrice?: number | null
  promotionalPrice?: number | null
  createdAt: string
  isActive?: boolean
}

export interface OcopProductFormData {
  name: string
  description?: string
  categoryId?: number
  enterpriseId?: number
  referencePrice?: number
  promotionalPrice?: number
  contactPhone?: string
  contactAddress?: string
  latitude?: number
  longitude?: number
  imagePublicIds?: string[]
}

export type { OcopProductDto, OcopProductImageDto } from '@/api/models'
