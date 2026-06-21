export interface NewsTableRow {
  publicId: string
  title: string
  slug: string | null
  authorName: string | null
  viewCount: number
  publishedAt: string | null
  thuTu: number
  isActive: boolean
  createdAt: string
  coverImageUrl: string | null
}
