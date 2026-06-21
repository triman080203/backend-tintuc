import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supportGroupApi } from '@/api/support-groups'
import { supportGroupCategoryApi } from '@/api/support-group-categories'
import type {
  CreateSupportGroupCommand,
  UpdateSupportGroupCommand,
  DeleteSupportGroupCommand,
  GetApiZaloMiniAppAdminServicesSupportGroupsParams,
} from '@/api/models'

export const useSupportGroups = (params?: GetApiZaloMiniAppAdminServicesSupportGroupsParams) => {
  return useQuery({
    queryKey: ['support-groups', params],
    queryFn: () => supportGroupApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupportGroupDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['support-group', publicId],
    queryFn: async () => {
      const response = await supportGroupApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupportGroupCategoryOptions = () => {
  return useQuery({
    queryKey: ['support-group-categories-options'],
    queryFn: () => supportGroupCategoryApi.list({ PageSize: 1000 }),
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreateSupportGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSupportGroupCommand) => supportGroupApi.create(data),
    onSuccess: () => {
      toast.success('Tạo nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-groups'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSupportGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSupportGroupCommand) => supportGroupApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-groups'] })
      queryClient.invalidateQueries({ queryKey: ['support-group', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSupportGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteSupportGroupCommand) => supportGroupApi.delete(data),
    onSuccess: () => {
      toast.success('Xóa nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-groups'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
