import { useQuery } from '@tanstack/react-query'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { GetApiAdminTintucParams, GetApiAdminTintucCategoriesParams } from '@/api/models'

export const useBaoChiNewsList = (params?: GetApiAdminTintucParams) => {
  return useQuery({
    queryKey: ['bao-chi-news', params],
    // For Bao Chi, we only fetch Published (Status 5) and IsPublic = true
    queryFn: () => getTinTucAdmin().getApiAdminTintuc({
      ...params,
      CurrentStatusId: 5,
      IsPublic: true,
      IsActive: true
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBaoChiNewsDetail = (publicId: string, enabled = true) => {
  return useQuery({
    queryKey: ['bao-chi-detail', publicId],
    queryFn: () => getTinTucAdmin().getApiAdminTintucPublicId(publicId),
    enabled: enabled && !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBaoChiCategories = (params?: GetApiAdminTintucCategoriesParams) => {
  return useQuery({
    queryKey: ['bao-chi-categories', params],
    queryFn: () => getTinTucAdmin().getApiAdminTintucCategories({
      ...params,
      IsActive: true
    }),
    staleTime: 1000 * 60 * 60, // 1 hour for categories
  })
}
