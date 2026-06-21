import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { iconCategoryApi } from '@/api/icon-categories'
import type {
  CreateIconCategoryCommand,
  UpdateIconCategoryCommand,
  DeleteIconCategoryCommand,
  GetApiZaloMiniAppAdminServicesIconCategoriesParams,
} from '@/api/models'

export const useIconCategories = (params?: GetApiZaloMiniAppAdminServicesIconCategoriesParams) => {
  return useQuery({
    queryKey: ['icon-categories', params],
    queryFn: () => iconCategoryApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useIconCategoryDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['icon-category', publicId],
    queryFn: async () => {
      const response = await iconCategoryApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateIconCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIconCategoryCommand) => iconCategoryApi.create(data),
    onSuccess: () => {
      toast.success('Tạo danh mục icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateIconCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIconCategoryCommand) => iconCategoryApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật danh mục icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-categories'] })
      queryClient.invalidateQueries({ queryKey: ['icon-category', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteIconCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteIconCategoryCommand) => iconCategoryApi.delete(data),
    onSuccess: () => {
      toast.success('Xóa danh mục icon thành công')
      queryClient.invalidateQueries({ queryKey: ['icon-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
