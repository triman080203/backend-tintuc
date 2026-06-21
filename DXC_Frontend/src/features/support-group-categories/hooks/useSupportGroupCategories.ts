import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supportGroupCategoryApi } from '@/api/support-group-categories'
import type {
  CreateSupportGroupCategoryCommand,
  UpdateSupportGroupCategoryCommand,
  DeleteSupportGroupCategoryCommand,
  GetApiZaloMiniAppAdminServicesSupportGroupsCategoriesParams,
} from '@/api/models'

export const useSupportGroupCategories = (params?: GetApiZaloMiniAppAdminServicesSupportGroupsCategoriesParams) => {
  return useQuery({
    queryKey: ['support-group-categories', params],
    queryFn: () => supportGroupCategoryApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupportGroupCategoryDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['support-group-category', publicId],
    queryFn: async () => {
      const response = await supportGroupCategoryApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateSupportGroupCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSupportGroupCategoryCommand) => supportGroupCategoryApi.create(data),
    onSuccess: () => {
      toast.success('Tạo danh mục nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-group-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateSupportGroupCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSupportGroupCategoryCommand) => supportGroupCategoryApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật danh mục nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-group-categories'] })
      queryClient.invalidateQueries({ queryKey: ['support-group-category', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteSupportGroupCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteSupportGroupCategoryCommand) => supportGroupCategoryApi.delete(data),
    onSuccess: () => {
      toast.success('Xóa danh mục nhóm hỗ trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['support-group-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}