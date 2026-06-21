export type {
  HomestayDto,
  HomestayImageDto,
  CreateHomestayCommand,
  UpdateHomestayCommand,
  DeleteHomestayCommand,
  GetApiZaloMiniAppAdminHomestaysParams,
  PagedResultOfHomestayDto,
  ApiResultOfHomestayDto,
} from '@/api/models'

// Local types for UI components
export interface HomestayTableRow {
  publicId: string
  name: string | null
  address: string | null
  phoneNumber: string | null
  website: string | null
  linkVitri: string | null
  averagePrice: number | null
  averagePriceCurrency: string | null
  createdAt: string
  imageCount?: number
  thuTu?: number
}

export interface HomestayFormData {
  name: string
  address: string
  description?: string
  phoneNumber?: string
  website?: string
  linkVitri?: string
  averagePrice?: number
  latitude?: number | null
  longitude?: number | null
  imagePublicIds?: string[]
}

export interface HomestaySearchParams {
  name?: string
  address?: string
  isActive?: boolean
  current?: number
  pageSize?: number
}
