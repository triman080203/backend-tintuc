import { useQuery } from '@tanstack/react-query'
import { getCommonAdmin } from '@/api/endpoints/common-admin'

export const useOrganizationDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['organization', publicId],
    queryFn: () => getCommonAdmin().getApiAdminCommonOrganizationsPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}
