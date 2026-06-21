export interface OrderTableRow {
  publicId: string
  bookingCode: string | null
  customerName: string | null
  phoneNumber: string | null
  tourId?: string | null
  ticketId?: string | null
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
}
