export interface TotalUserTableRow {
  id: number
  userId: string
  username: string
 avatar?: string | null
  phanQuyen?: string | null
  phoneNumber?: string | null
}

export interface TotalUserFormData {
  userId: string
  username: string
 avatar?: string
 phanQuyen?: boolean
  phoneNumber?: string
}

