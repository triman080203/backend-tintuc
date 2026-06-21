import { useQuery } from '@tanstack/react-query'
import { getFeedbackAdmin } from '@/api/endpoints/feedback-admin'
import type { GetApiZaloMiniAppAdminFeedbackListParams } from '@/api/models'

export const useFeedbackList = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  // Chỉ lấy các phản ánh có trạng thái = 1 (đã gửi)
  const filteredParams = {
    ...params,
    currentStatusId: 1, // Chỉ lấy phản ánh đã gửi
  }

  return useQuery({
    queryKey: ['feedback-list', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useFeedbackProcessing = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  // Chỉ lấy các phản ánh có trạng thái = 2 (đang xử lý)
  const filteredParams = {
    ...params,
    currentStatusId: 2, // Chỉ lấy phản ánh đang xử lý
  }

  return useQuery({
    queryKey: ['feedback-processing', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useFeedbackApproval = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  // Chỉ lấy các phản ánh có trạng thái = 3 (chờ duyệt)
  const filteredParams = {
    ...params,
    currentStatusId: 3, // Chỉ lấy phản ánh chờ duyệt
  }

  return useQuery({
    queryKey: ['feedback-approval', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useFeedbackPublic = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  // Chỉ lấy các phản ánh có trạng thái = 4 (đã hoàn thành)
  const filteredParams = {
    ...params,
    currentStatusId: 4, // Chỉ lấy phản ánh đã hoàn thành
  }

  return useQuery({
    queryKey: ['feedback-public', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useFeedbackRejected = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  // Chỉ lấy các phản ánh có trạng thái = 5 (từ chối)
  const filteredParams = {
    ...params,
    currentStatusId: 5, // Chỉ lấy phản ánh từ chối
  }

  return useQuery({
    queryKey: ['feedback-rejected', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useFeedbackDetail = (publicId: string, enabled = true) => {
  return useQuery({
    queryKey: ['feedback-detail', publicId],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackPublicId(publicId),
    enabled: enabled && !!publicId,
    staleTime: 1000 * 60, // 1 minute
  })
}

export const useFeedbackProcessingByDepartment = (
  params?: GetApiZaloMiniAppAdminFeedbackListParams,
  departmentPublicId?: string | null
) => {
  const enabled = !!departmentPublicId
  const filteredParams = {
    ...params,
    currentStatusId: 2,
    ...(departmentPublicId && { assignedDepartmentPublicId: departmentPublicId }),
  }

  return useQuery({
    queryKey: ['feedback-processing', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2,
    enabled,
  })
}

export const useFeedbackApprovalByDepartment = (
  params?: GetApiZaloMiniAppAdminFeedbackListParams,
  departmentPublicId?: string | null
) => {
  const enabled = !!departmentPublicId
  const filteredParams = {
    ...params,
    currentStatusId: 3,
    ...(departmentPublicId && { assignedDepartmentPublicId: departmentPublicId }),
  }

  return useQuery({
    queryKey: ['feedback-approval', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2,
    enabled,
  })
}

export const useFeedbackPublicByDepartment = (
  params?: GetApiZaloMiniAppAdminFeedbackListParams,
  departmentPublicId?: string | null,
  userRoles?: string[] | null
) => {
  const enabled = !!departmentPublicId
  const isCoordinator = userRoles?.includes('dieu_phoi_phan_anh') || false
  const filteredParams = {
    ...params,
    currentStatusId: 4,
    ...(departmentPublicId && !isCoordinator && { assignedDepartmentPublicId: departmentPublicId }),
  }

  return useQuery({
    queryKey: ['feedback-public', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2,
    enabled,
  })
}

export const useFeedbackRejectedWithRole = (params?: GetApiZaloMiniAppAdminFeedbackListParams) => {
  const filteredParams = {
    ...params,
    currentStatusId: 5,
  }

  return useQuery({
    queryKey: ['feedback-rejected', filteredParams],
    queryFn: () => getFeedbackAdmin().getApiZaloMiniAppAdminFeedbackList(filteredParams),
    staleTime: 1000 * 60 * 2,
  })
}
