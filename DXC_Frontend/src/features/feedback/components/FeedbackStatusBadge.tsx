// import { Badge } from '@/components/ui/badge' // Removed - using custom div instead
import { getStatusColor } from '../types'
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  HelpCircle
} from 'lucide-react'

interface FeedbackStatusBadgeProps {
  statusCode: string | null
  statusName: string | null
  statusColor?: string | null
}

const FeedbackStatusBadge = ({
  statusCode,
  statusName,
  statusColor,
}: FeedbackStatusBadgeProps) => {
  const color = statusColor || getStatusColor(statusCode)

  

  const getColorClasses = (color: string) => {
    // For fallback named colors only
    switch (color) {
      case 'green':
        return '!bg-emerald-100 !text-emerald-800 !border-emerald-200'
      case 'blue':
        return '!bg-blue-100 !text-blue-800 !border-blue-200'
      case 'cyan':
        return '!bg-cyan-100 !text-cyan-800 !border-cyan-200'
      case 'yellow':
        return '!bg-amber-100 !text-amber-800 !border-amber-200'
      case 'red':
        return '!bg-red-100 !text-red-800 !border-red-200'
      case 'gray':
      default:
        return '!bg-gray-100 !text-gray-700 !border-gray-200'
    }
  }

  const getInlineStyle = (color: string) => {
    if (color.startsWith('#')) {
      return {
        backgroundColor: `${color}20`, // Add transparency
        color: color,
        borderColor: `${color}40`, // Darker border
      }
    }
    return {}
  }

  const getStatusIcon = (statusCode: string | null) => {
    switch (statusCode) {
      // Database status codes
      case 'submitted':
        return <FileText className="h-3 w-3 mr-1" />
      case 'in_progress':
        return <Clock className="h-3 w-3 mr-1 animate-pulse" />
      case 'waiting_for_approval':
        return <AlertCircle className="h-3 w-3 mr-1" />
      case 'completed':
        return <CheckCircle className="h-3 w-3 mr-1" />
      case 'rejected':
        return <XCircle className="h-3 w-3 mr-1" />
      // Fallback cases (uppercase versions)
      case 'SUBMITTED':
        return <FileText className="h-3 w-3 mr-1" />
      case 'IN_PROGRESS':
        return <Clock className="h-3 w-3 mr-1 animate-pulse" />
      case 'WAITING_FOR_APPROVAL':
        return <AlertCircle className="h-3 w-3 mr-1" />
      case 'COMPLETED':
        return <CheckCircle className="h-3 w-3 mr-1" />
      case 'REJECTED':
        return <XCircle className="h-3 w-3 mr-1" />
      default:
        return <HelpCircle className="h-3 w-3 mr-1" />
    }
  }

  return (
    <div 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${color.startsWith('#') ? '' : getColorClasses(color)}`}
      style={getInlineStyle(color)}
    >
      {getStatusIcon(statusCode)}
      {statusName || 'Không xác định'}
    </div>
  )
}

export default FeedbackStatusBadge
