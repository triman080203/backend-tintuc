import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hotlineApi } from '@/api/hotlines'
import { hotlineCategoryApi } from '@/api/hotline-categories'
import type { GetApiZaloMiniAppAdminServicesHotlinesParams } from '@/api/models'

// ========================================
// QUERIES (Read-only)
// ========================================

export const useHotlines = (params: GetApiZaloMiniAppAdminServicesHotlinesParams) => {
  return useQuery({
    queryKey: ['hotlines', params],
    queryFn: () => hotlineApi.list(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useHotlineCategories = () => {
  return useQuery({
    queryKey: ['hotline-categories-all'],
    queryFn: () => hotlineCategoryApi.list({ PageSize: 1000 }),
    staleTime: 10 * 60 * 1000,
  })
}

export const useHotlineDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['hotline', publicId],
    queryFn: () => hotlineApi.detail(publicId),
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000,
  })
}

// ========================================
// MUTATIONS (Write operations)
// ========================================

export const useCreateHotline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => hotlineApi.create(data),
    onSuccess: () => {
      toast.success('Tạo thành công')
      queryClient.invalidateQueries({ queryKey: ['hotlines'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateHotline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => hotlineApi.update(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật thành công')
      queryClient.invalidateQueries({ queryKey: ['hotlines'] })
      queryClient.invalidateQueries({ queryKey: ['hotline', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteHotline = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) => hotlineApi.delete({ publicId }),
    onSuccess: () => {
      toast.success('Xóa thành công')
      queryClient.invalidateQueries({ queryKey: ['hotlines'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
