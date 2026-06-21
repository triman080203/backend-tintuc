export interface HotlineTableRow {
  publicId?: string
  contactName: string | null
  phoneNumber: string | null
  categoryName: string | null
  description?: string | null
  createdAt?: string
  thuTu?: number
}

export interface HotlineFormData {
  contactName: string
  categoryPublicId: string
  phoneNumber: string
  description?: string
  thuTu?: number
}

export type { HotlineDto } from '@/api/models'
