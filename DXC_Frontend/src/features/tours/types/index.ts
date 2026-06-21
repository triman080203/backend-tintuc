export interface TourTableRow {
  publicId: string
  name: string
  price: number
  durationDays: number
  durationNights: number
  departureLocation: string | null
  maxParticipants: number
  isActive: boolean
  createdAt: string
}
