import { useQuery } from '@tanstack/react-query';
import { getFeedbackTracking } from '@/api/endpoints/feedback-tracking';
import type { GetApiZaloMiniAppAdminFeedbackTrackingParams } from '@/api/models';

// ========================================
// QUERIES (Read-only)
// ========================================

// List items - Returns PagedResult<T>
export const useFeedbackTrackings = (params: GetApiZaloMiniAppAdminFeedbackTrackingParams) => {
  return useQuery({
    queryKey: ['feedback-trackings', params],
    queryFn: () => getFeedbackTracking().getApiZaloMiniAppAdminFeedbackTracking(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single item detail - Returns ApiResult<T>
export const useFeedbackTrackingDetail = (id: string) => {
  return useQuery({
    queryKey: ['feedback-tracking', id],
    queryFn: () => getFeedbackTracking().postApiZaloMiniAppAdminFeedbackTrackingPublicIdGet(id),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
  });
};