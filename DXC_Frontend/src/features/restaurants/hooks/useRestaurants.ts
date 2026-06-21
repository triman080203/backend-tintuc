import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppRestaurantsAdmin } from '@/api/endpoints/zalo-mini-app-restaurants-admin'
import type {
  GetApiZaloMiniAppAdminRestaurantsParams,
  CreateRestaurantCommand,
  UpdateRestaurantCommand,
} from '@/api/models'

export const useRestaurants = (params?: GetApiZaloMiniAppAdminRestaurantsParams) => {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => getZaloMiniAppRestaurantsAdmin().getApiZaloMiniAppAdminRestaurants(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useRestaurantDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['restaurant', publicId],
    queryFn: async () => {
      const response = await getZaloMiniAppRestaurantsAdmin().getApiZaloMiniAppAdminRestaurantsPublicId(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRestaurantCommand) => {
      const result = await getZaloMiniAppRestaurantsAdmin().postApiZaloMiniAppAdminRestaurantsCreate(data)
      if (!result.success) {
        throw new Error(result.message || 'Tạo nhà hàng thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Tạo nhà hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
    },
    onError: (error: Error) => {
      toast.error('Tạo nhà hàng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateRestaurantCommand) => {
      const result = await getZaloMiniAppRestaurantsAdmin().postApiZaloMiniAppAdminRestaurantsUpdate(data)
      if (!result.success) {
        throw new Error(result.message || 'Cập nhật nhà hàng thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Cập nhật nhà hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật nhà hàng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (publicId: string) => {
      const result = await getZaloMiniAppRestaurantsAdmin().postApiZaloMiniAppAdminRestaurantsDelete({ publicId })
      if (!result.success) {
        throw new Error(result.message || 'Xóa nhà hàng thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Xóa nhà hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
    },
    onError: (error: Error) => {
      toast.error('Xóa nhà hàng thất bại', {
        description: error.message,
      })
    },
  })
}
