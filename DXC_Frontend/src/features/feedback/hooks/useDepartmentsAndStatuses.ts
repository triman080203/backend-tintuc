import { useQuery } from '@tanstack/react-query'
import { getCommonAdmin } from '@/api/endpoints/common-admin'
import { getFeedbackAdmin } from '@/api/endpoints/feedback-admin'
import type { GetApiAdminCommonDepartmentsParams } from '@/api/models'

/**
 * Hook to fetch departments for feedback assignment
 * Uses official departments API: /admin/common/departments (migrated from /admin/feedback/departments)
 */
export const useDepartments = (params?: GetApiAdminCommonDepartmentsParams) => {
  return useQuery({
    queryKey: ['departments', 'active', params],
    queryFn: () => getCommonAdmin().getApiAdminCommonDepartments({
      ...params,
      IsActive: true,
    }),
    staleTime: 1000 * 60 * 10, // 10 minutes - departments don't change often
    select: (data) => {
      // Transform DepartmentDto[] to simpler format for dropdown
      if (!data?.data || !Array.isArray(data.data)) return []
      
      return data.data.map((dept) => ({
        // Use publicId as identifier since assign API now expects publicId
        publicId: dept.publicId || '',
        name: dept.name || 'Chưa có tên',
        code: dept.code || '',
        description: dept.description || '',
        contactEmail: dept.contactEmail || '',
        contactPhone: dept.contactPhone || '',
      }))
    },
  })
}

/**
 * Hook to fetch active feedback statuses
 * Uses official statuses API: /admin/feedback/statuses/active
 * 
 * Status codes:
 * - submitted: Đã gửi (waiting to be processed)
 * - in_progress: Đang xử lý (assigned to department)
 * - waiting_for_approval: Chờ duyệt (response created, waiting for approval)
 * - completed: Hoàn thành (approved and published)
 * - rejected: Từ chối (rejected)
 */
export const useFeedbackStatuses = () => {
  return useQuery({
    queryKey: ['feedback-statuses', 'active'],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackStatusesActive(),
    staleTime: 1000 * 60 * 10, // 10 minutes - statuses don't change often
    select: (data) => {
      // Transform FeedbackStatusDto[] to simpler format for dropdown
      if (!data?.data || !Array.isArray(data.data)) return []
      
      return data.data.map((status) => ({
        // Use publicId as the identifier for feedback statuses
        id: status.publicId || '',
        name: status.name || 'Chưa có tên',
        code: status.code || '',
        color: status.color || '#666666',
        description: status.description || '',
        sortOrder: status.sortOrder || 0,
      }))
    },
  })
}
