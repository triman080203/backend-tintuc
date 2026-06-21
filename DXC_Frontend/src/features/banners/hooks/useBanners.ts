import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getBannersApi } from '@/api/banners'
import type {
  GetApiZaloMiniAppAdminBannersParams,
  CreateBannerCommand,
  UpdateBannerCommand,
} from '@/api/models'

export const useBanners = (params?: GetApiZaloMiniAppAdminBannersParams) => {
  return useQuery({
    queryKey: ['banners', params],
    queryFn: () => getBannersApi().getApiZaloMiniAppAdminBanners(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useBannerDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['banner', publicId],
    queryFn: async () => {
      const response = await getBannersApi().getApiZaloMiniAppAdminBannersPublicId(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateBannerCommand) => {
      const result = await getBannersApi().postApiZaloMiniAppAdminBannersCreate(data)
      if (!result.success) {
        throw new Error(result.message || 'Tạo banner thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Tạo banner thành công')
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
    onError: (error: Error) => {
      toast.error('Tạo banner thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateBannerCommand) => {
      const result = await getBannersApi().postApiZaloMiniAppAdminBannersUpdate(data)
      if (!result.success) {
        throw new Error(result.message || 'Cập nhật banner thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Cập nhật banner thành công')
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật banner thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (publicId: string) => {
      const result = await getBannersApi().postApiZaloMiniAppAdminBannersDelete({ publicId })
      if (!result.success) {
        throw new Error(result.message || 'Xóa banner thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Xóa banner thành công')
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
    onError: (error: Error) => {
      toast.error('Xóa banner thất bại', {
        description: error.message,
      })
    },
  })
}
