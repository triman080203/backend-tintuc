import { useQuery } from '@tanstack/react-query'
import { customRequest } from '@/api/request'

type DashboardStatsDto = {
  totalFeedbacks: number
  processingFeedbacks: number
  approvedFeedbackResponses: number
  totalUsers: number
}

type ApiResult<T> = {
  success: boolean
  data: T
  message?: string | null
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () =>
      customRequest<ApiResult<DashboardStatsDto>>({
        url: '/api/dashboard/stats',
        method: 'GET',
      }),
    staleTime: 1000 * 60,
  })
}