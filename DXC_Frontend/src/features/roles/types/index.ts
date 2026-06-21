export interface RoleTableRow {
  publicId?: string
  name: string | null
  code?: string | null
  description?: string | null
  createdDate?: string
}

export type { GetApiUsersRolesParams } from '@/api/models'
