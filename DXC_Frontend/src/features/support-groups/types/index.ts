export interface SupportGroupTableRow {
  publicId?: string
  categoryName: string | null
  categoryPublicId?: string
  groupName: string | null
  groupLink?: string | null
  groupType?: string | null
  description?: string | null
  isActive?: boolean
  createdAt?: string
}

export interface SupportGroupFormData {
  categoryPublicId: string
  groupName: string
  groupLink?: string
  groupType?: string
  description?: string
}

export type {
  SupportGroupDto,
  GetApiZaloMiniAppAdminServicesSupportGroupsParams,
} from '@/api/models'
