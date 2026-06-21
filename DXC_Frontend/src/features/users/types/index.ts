export interface UserTableRow {
  publicId?: string
  fullName: string | null
  userName: string | null
  email: string | null
  isActive?: boolean
  createdAt?: string
  roleCodes?: string[] | null
  departmentName?: string | null
  organizationName?: string | null
}
