export interface IconTableRow {
  publicId: string
  name: string
  description?: string | null
  iconGroupPublicId?: string | null
  iconGroupName?: string
  iconCategoryPublicId?: string | null
  iconCategoryName?: string
  linkAndroid?: string | null
  linkIOS?: string | null
  createdAt?: string
}

export interface IconFormData {
  name: string
  description?: string
  iconGroupPublicId?: string
  iconCategoryPublicId?: string
}

export type { IconDto } from '@/api/models'
