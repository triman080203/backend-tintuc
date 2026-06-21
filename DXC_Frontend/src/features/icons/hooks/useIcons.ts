import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { iconApi } from '@/api/icons'
import type {
  CreateIconCommand,
  UpdateIconCommand,
  GetApiZaloMiniAppAdminServicesIconsParams,
} from '@/api/models'

export const useIcons = (params?: GetApiZaloMiniAppAdminServicesIconsParams) => {
  return useQuery({
    queryKey: ['icons', params],
    queryFn: () => iconApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useIconDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['icon', publicId],
    queryFn: async () => {
      const response = await iconApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateIcon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIconCommand) => iconApi.create(data),
    onSuccess: () => {
      toast.success('Tạo icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icons'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateIcon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIconCommand) => iconApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icons'] })
      queryClient.invalidateQueries({ queryKey: ['icon', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteIcon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) => iconApi.delete(publicId),
    onSuccess: () => {
      toast.success('Xóa icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icons'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
