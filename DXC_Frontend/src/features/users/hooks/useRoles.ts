import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/endpoints/users'
import type { GetApiUsersRolesParams } from '@/api/models'

export const useRoles = (params?: GetApiUsersRolesParams) => {
  // Default to fetching all roles by setting a large page size
  const defaultParams: GetApiUsersRolesParams = {
    Current: 1,
    PageSize: 100, // Large number to get all roles
    ...params,
  }
  
  return useQuery({
    queryKey: ['roles', defaultParams],
    queryFn: () => getUsers().getApiUsersRoles(defaultParams),
    staleTime: 1000 * 60 * 10, // 10 minutes - roles change less frequently
  })
}

export const useRole = (publicId: string) => {
  return useQuery({
    queryKey: ['role', publicId],
    queryFn: () => getUsers().getApiUsersRolesPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 10,
  })
}