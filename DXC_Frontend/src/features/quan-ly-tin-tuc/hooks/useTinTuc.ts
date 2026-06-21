import { useQuery } from '@tanstack/react-query'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { GetApiAdminTintucParams } from '@/api/models'

export const useTinTucList = (params?: GetApiAdminTintucParams) => {
  return useQuery({
    queryKey: ['tin-tuc-list', params],
    queryFn: () => getTinTucAdmin().getApiAdminTintuc(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useTinTucDetail = (publicId: string, enabled = true) => {
  return useQuery({
    queryKey: ['tin-tuc-detail', publicId],
    queryFn: () => getTinTucAdmin().getApiAdminTintucPublicId(publicId),
    enabled: enabled && !!publicId,
    staleTime: 1000 * 60, // 1 minute
  })
}
