import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ocopCategoriesApi } from '@/api/ocop-categories'
import type { CreateOcopProductCategoryCommand, UpdateOcopProductCategoryCommand, OcopProductCategoryDto } from '@/api/models'

export const useOcopCategories = (params?: {
  Current?: number
  PageSize?: number
  searchTerm?: string
}) => {
  return useQuery({
    queryKey: ['ocop-categories', params],
    queryFn: () => ocopCategoriesApi.getApiZaloMiniAppAdminOcopCategories({
      Current: params?.Current || 1,
      PageSize: params?.PageSize || 10,
      Name: params?.searchTerm,
    }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useOcopCategoryDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['ocop-category', publicId],
    queryFn: async () => {
      const res = await ocopCategoriesApi.getApiZaloMiniAppAdminOcopCategoriesPublicId(publicId)
      return (res.data as OcopProductCategoryDto) || null
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateOcopCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOcopProductCategoryCommand) =>
      ocopCategoriesApi.postApiZaloMiniAppAdminOcopCategoriesCreate(data),
    onSuccess: () => {
      toast.success('Tạo danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo danh mục')
    },
  })
}

export const useUpdateOcopCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateOcopProductCategoryCommand) =>
      ocopCategoriesApi.postApiZaloMiniAppAdminOcopCategoriesUpdate(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-categories'] })
      queryClient.invalidateQueries({ queryKey: ['ocop-category', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi cập nhật danh mục')
    },
  })
}

export const useDeleteOcopCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) =>
      ocopCategoriesApi.postApiZaloMiniAppAdminOcopCategoriesDelete({ publicId }),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi xóa danh mục')
    },
  })
}
