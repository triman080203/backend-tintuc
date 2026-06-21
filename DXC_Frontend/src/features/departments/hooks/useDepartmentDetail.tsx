import { useQuery } from '@tanstack/react-query'
import { getCommonAdmin } from '@/api/endpoints/common-admin'

export const useDepartmentDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['department', publicId],
    queryFn: () => getCommonAdmin().getApiAdminCommonDepartmentsPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}
