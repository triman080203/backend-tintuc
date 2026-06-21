// Re-export API types for convenience
export type {
  FeedbackAdminDto,
  FeedbackDetailDto,
  FeedbackResponseDto,
  CreateFeedbackDto,
  UpdateFeedbackDto,
  AssignFeedbackDto,
  ProcessFeedbackDto,
  CreateFeedbackResponseDto,
  UpdateFeedbackResponseDto,
  ApproveFeedbackResponseDto,
  RejectFeedbackResponseDto,
  FeedbackAttachmentDto,
  FeedbackProcessingDto,
  FeedbackResponseAttachmentDto,
  PagedResultOfFeedbackAdminDto,
  PagedResultOfFeedbackResponseDto,
  GetApiZaloMiniAppAdminFeedbackListParams,
  GetApiZaloMiniAppAdminFeedbackResponsesPendingApprovalParams,
  GetApiZaloMiniAppAdminFeedbackResponsesApprovedParams,
} from '@/api/models'

// Re-export schema types for convenience
export type {
  FeedbackFormData,
  AssignFeedbackFormData,
  ProcessFeedbackFormData,
  FeedbackResponseFormData,
  ApproveFeedbackResponseFormData,
  RejectFeedbackResponseFormData,
  UpdateFeedbackResponseFormData,
} from '../schemas'

// Local types
export interface FeedbackFilterParams {
  Current?: number
  PageSize?: number
  Title?: string
  StatusCode?: string
  DepartmentId?: number
  IsPublic?: boolean
}

export interface FeedbackApprovalFilterParams {
  Current?: number
  PageSize?: number
  DepartmentId?: number
}

// Status codes constants
export const FeedbackStatusCodes = {
  DRAFT: 'DRAFT',
  ASSIGNED: 'ASSIGNED',
  PROCESSING: 'PROCESSING',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
} as const

// Status ID constants (based on backend)
export const FeedbackStatusIds = {
  SUBMITTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  PENDING_APPROVAL: 3, // Both completed and pending approval might use ID 3
  REJECTED: 5,
  PUBLISHED: 4,
} as const

export type FeedbackStatusCode = (typeof FeedbackStatusCodes)[keyof typeof FeedbackStatusCodes]

// Status colors mapping
export const getStatusColor = (statusCode: string | null): string => {
  switch (statusCode) {
    // Database status codes
    case 'submitted':
      return 'yellow' // #FFA500 -> yellow
    case 'in_progress':
      return 'blue' // #007BFF -> blue
    case 'waiting_for_approval':
      return 'yellow' // #FFC107 -> yellow
    case 'completed':
      return 'green' // #28A745 -> green
    case 'rejected':
      return 'red' // #DC3545 -> red
    // Fallback cases
    case 'SUBMITTED':
      return 'yellow'
    case 'IN_PROGRESS':
      return 'blue'
    case 'WAITING_FOR_APPROVAL':
      return 'yellow'
    case 'COMPLETED':
      return 'green'
    default:
      return 'gray'
  }
}

// Response status mapping to match feedback status
export const getResponseStatus = (isApproved: boolean | null): { text: string; color: string } => {
  if (isApproved === true) {
    return { text: 'Đã duyệt', color: '#22c55e' } // green
  } else if (isApproved === false) {
    return { text: 'Đã từ chối', color: '#ef4444' } // red
  } else {
    return { text: 'Chờ duyệt', color: '#eab308' } // yellow
  }
}
