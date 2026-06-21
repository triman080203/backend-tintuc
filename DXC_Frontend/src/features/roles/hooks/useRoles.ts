import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers } from '@/api/endpoints/users'
import type { GetApiUsersRolesParams } from '@/api/models'

export const useRoles = (params?: GetApiUsersRolesParams) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => getUsers().getApiUsersRoles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      name: string
      code: string
      description?: string
    }) => getUsers().postApiUsersRolesCreate(data),
    onSuccess: () => {
      toast.success('Tạo vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      publicId: string
      name: string
      code: string
      description?: string
    }) => getUsers().postApiUsersRolesUpdate(data),
    onSuccess: () => {
      toast.success('Cập nhật vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['role'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (publicId: string) =>
      getUsers().postApiUsersRolesDelete({ publicId }),
    onSuccess: () => {
      toast.success('Xóa vai trò thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}