import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { iconGroupApi } from '@/api/icon-groups'
import type {
  CreateIconGroupCommand,
  UpdateIconGroupCommand,
  GetApiZaloMiniAppAdminServicesIconGroupsParams,
} from '@/api/models'

export const useIconGroups = (params?: GetApiZaloMiniAppAdminServicesIconGroupsParams) => {
  return useQuery({
    queryKey: ['icon-groups', params],
    queryFn: () => iconGroupApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useIconGroupDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['icon-group', publicId],
    queryFn: async () => {
      const response = await iconGroupApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateIconGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIconGroupCommand) => iconGroupApi.create(data),
    onSuccess: () => {
      toast.success('Tạo nhóm icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-groups'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateIconGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIconGroupCommand) => iconGroupApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật nhóm icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-groups'] })
      queryClient.invalidateQueries({ queryKey: ['icon-group', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteIconGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) => iconGroupApi.delete(publicId),
    onSuccess: () => {
      toast.success('Xóa nhóm icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-groups'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
