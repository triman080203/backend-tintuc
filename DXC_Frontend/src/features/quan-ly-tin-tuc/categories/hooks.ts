import { useQuery } from '@tanstack/react-query'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { GetApiAdminTintucCategoriesParams } from '@/api/models'

export const useTinTucCategoryList = (params?: GetApiAdminTintucCategoriesParams) => {
  return useQuery({
    queryKey: ['tin-tuc-category-list', params],
    queryFn: () => getTinTucAdmin().getApiAdminTintucCategories(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useTinTucCategoryDetail = (publicId: string, enabled = true) => {
  return useQuery({
    queryKey: ['tin-tuc-category-detail', publicId],
    queryFn: () => getTinTucAdmin().getApiAdminTintucCategoriesPublicId(publicId),
    enabled: enabled && !!publicId,
    staleTime: 1000 * 60, // 1 minute
  })
}
