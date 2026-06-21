import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/endpoints/users'

export const useRoleDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['role', publicId],
    queryFn: () => getUsers().getApiUsersRolesPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}