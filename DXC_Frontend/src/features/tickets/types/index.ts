export interface TicketTableRow {
  publicId: string
  name: string
  price: number
  childPrice?: number
  isActive: boolean
  createdAt: string
}
