import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers } from '@/api/endpoints/users'

export const useUserDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['user', publicId],
    queryFn: async () => {
      const response = await getUsers().getApiUsersPublicId(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { publicId: string; isActive: boolean }) => {
      // Update user status - this would typically call an API endpoint
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: (result) => {
      toast.success(
        result.isActive ? 'Kích hoạt người dùng thành công' : 'Vô hiệu hóa người dùng thành công'
      )
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', result.publicId] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật trạng thái người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useResetUserPassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (publicId: string) => {
      // Reset user password - this would typically call an API endpoint
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { publicId, newPassword: 'NewPassword123!' }
    },
    onSuccess: (result) => {
      toast.success('Đặt lại mật khẩu thành công', {
        description: `Mật khẩu mới: ${result.newPassword}`,
      })
      queryClient.invalidateQueries({ queryKey: ['user', result.publicId] })
    },
    onError: (error: Error) => {
      toast.error('Đặt lại mật khẩu thất bại', {
        description: error.message,
      })
    },
  })
}