import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hotlineCategoryApi } from '@/api/hotline-categories'
import type {
  DeleteHotlineCategoryCommand,
  GetApiZaloMiniAppAdminServicesHotlinesCategoriesParams,
} from '@/api/models'

export const useHotlineCategories = (params?: GetApiZaloMiniAppAdminServicesHotlinesCategoriesParams) => {
  return useQuery({
    queryKey: ['hotline-categories', params],
    queryFn: () => hotlineCategoryApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHotlineCategoryDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['hotline-category', publicId],
    queryFn: async () => {
      const response = await hotlineCategoryApi.detail(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateHotlineCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => hotlineCategoryApi.create(data as any),
    onSuccess: () => {
      toast.success('Tạo danh mục Hotline thành công')
      queryClient.invalidateQueries({ queryKey: ['hotline-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateHotlineCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => hotlineCategoryApi.update(data as any),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật danh mục Hotline thành công')
      queryClient.invalidateQueries({ queryKey: ['hotline-categories'] })
      queryClient.invalidateQueries({ queryKey: ['hotline-category', (variables as any).publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteHotlineCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteHotlineCategoryCommand) => hotlineCategoryApi.delete(data),
    onSuccess: () => {
      toast.success('Xóa danh mục Hotline thành công')
      queryClient.invalidateQueries({ queryKey: ['hotline-categories'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
