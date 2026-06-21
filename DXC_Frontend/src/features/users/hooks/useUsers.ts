import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers } from '@/api/endpoints/users'
import type { GetApiUsersParams } from '@/api/models'

export const useUsers = (params?: GetApiUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers().getApiUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      fullName: string
      userName: string
      email: string
      password: string
      roleCodes?: string[]
    }) => getUsers().postApiUsersCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo người dùng thành công')
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error('Tạo người dùng thất bại', {
          description: result.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      publicId: string
      fullName: string | null
      email: string | null
      isActive?: boolean
      roleCodes?: string[] | null
    }) => getUsers().postApiUsersUpdate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Cập nhật người dùng thành công')
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['user'] })
      } else {
        toast.error('Cập nhật người dùng thất bại', {
          description: result.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (publicId: string) =>
      getUsers().postApiUsersDelete({ publicId }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa người dùng thành công')
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error('Xóa người dùng thất bại', {
          description: result.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (data: { publicId: string; newPassword: string }) =>
      getUsers().postApiUsersResetPassword(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Đã đặt lại mật khẩu người dùng')
      } else {
        toast.error('Đặt lại mật khẩu thất bại', {
          description: result.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Đặt lại mật khẩu thất bại', {
        description: error.message,
      })
    },
  })
}
