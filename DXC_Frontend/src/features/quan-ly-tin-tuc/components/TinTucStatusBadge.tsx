import { Badge } from '@/components/ui/badge'

interface TinTucStatusBadgeProps {
  statusId?: number
  statusCode?: string
  statusName?: string
  statusColor?: string
}

export const TinTucStatusBadge = ({
  statusId,
  statusCode,
  statusName,
  statusColor,
}: TinTucStatusBadgeProps) => {
  if (!statusId && !statusCode) return null

  // Fallback default colors if statusColor is not provided from API
  let badgeColor = statusColor
  if (!badgeColor) {
    switch (statusCode) {
      case 'draft':
        badgeColor = '#9CA3AF' // gray-400
        break
      case 'pending':
        badgeColor = '#F59E0B' // amber-500
        break
      case 'approved':
        badgeColor = '#3B82F6' // blue-500
        break
      case 'published':
        badgeColor = '#10B981' // emerald-500
        break
      case 'returned':
        badgeColor = '#EF4444' // red-500
        break
      case 'archived':
        badgeColor = '#6B7280' // gray-500
        break
      default:
        badgeColor = '#9CA3AF'
    }
  }

  return (
    <Badge
      variant="outline"
      style={{
        backgroundColor: `${badgeColor}1A`, // 10% opacity for background
        color: badgeColor,
        borderColor: badgeColor,
      }}
      className="font-medium whitespace-nowrap"
    >
      {statusName || statusCode}
    </Badge>
  )
}
