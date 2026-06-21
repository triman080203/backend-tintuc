import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppArticlesAdmin } from '@/api/endpoints/zalo-mini-app-articles-admin'
import type {
  GetApiZaloMiniAppAdminArticlesParams,
  CreateArticleCommand,
  UpdateArticleCommand,
  DeleteArticleCommand,
} from '@/api/models'

// Query Keys
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (params: GetApiZaloMiniAppAdminArticlesParams) => [...newsKeys.lists(), params] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
}

// List News Hook
export const useNews = (params: GetApiZaloMiniAppAdminArticlesParams = {}) => {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => getZaloMiniAppArticlesAdmin().getApiZaloMiniAppAdminArticles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get News Detail Hook
export const useNewsDetail = (publicId: string) => {
  return useQuery({
    queryKey: newsKeys.detail(publicId),
    queryFn: () => getZaloMiniAppArticlesAdmin().getApiZaloMiniAppAdminArticlesPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Create News Hook
export const useCreateNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateArticleCommand) =>
      getZaloMiniAppArticlesAdmin().postApiZaloMiniAppAdminArticlesCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo bài viết thành công')
        queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Tạo bài viết thất bại')
    },
  })
}

// Update News Hook
export const useUpdateNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateArticleCommand) =>
      getZaloMiniAppArticlesAdmin().postApiZaloMiniAppAdminArticlesUpdate(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật bài viết thành công')
        queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
        if (variables.publicId) {
          queryClient.invalidateQueries({ queryKey: newsKeys.detail(variables.publicId) })
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật bài viết thất bại')
    },
  })
}

// Delete News Hook
export const useDeleteNews = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteArticleCommand) =>
      getZaloMiniAppArticlesAdmin().postApiZaloMiniAppAdminArticlesDelete(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa bài viết thành công')
        queryClient.invalidateQueries({ queryKey: newsKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa bài viết thất bại')
    },
  })
}
