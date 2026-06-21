export interface OcopEnterpriseTableRow {
  publicId: string
  name: string
  taxCode?: string | null
  representative?: string | null
  phoneNumber?: string | null
  isActive?: boolean
  createdAt: string
}

export interface OcopEnterpriseFormData {
  name: string
  phoneNumber?: string
  representative?: string
  taxCode?: string
  establishedYear?: number
  address?: string
  ocopCertificateNumber?: string
  latitude?: number
  longitude?: number
}

export type { OcopEnterpriseDto } from '@/api/models'
