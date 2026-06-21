import { useQuery } from '@tanstack/react-query'
import { getIdentity } from '@/api/endpoints/identity'
import type { UserDto } from '@/api/models'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const result = await getIdentity().getApiIdentityCurrentUser()
      return result.data as UserDto
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
