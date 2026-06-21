import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppHotelsAdmin } from '@/api/endpoints/zalo-mini-app-hotels-admin'
import type {
  GetApiZaloMiniAppAdminHotelsParams,
  CreateHotelCommand,
  UpdateHotelCommand,
} from '@/api/models'

export const useHotels = (params?: GetApiZaloMiniAppAdminHotelsParams) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => getZaloMiniAppHotelsAdmin().getApiZaloMiniAppAdminHotels(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useHotelDetail = (publicId: string) => {
  return useQuery({
    queryKey: ['hotel', publicId],
    queryFn: async () => {
      const response = await getZaloMiniAppHotelsAdmin().getApiZaloMiniAppAdminHotelsPublicId(publicId)
      return response.data
    },
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateHotelCommand) => {
      const result = await getZaloMiniAppHotelsAdmin().postApiZaloMiniAppAdminHotelsCreate(data)
      if (!result.success) {
        throw new Error(result.message || 'Tạo khách sạn thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Tạo khách sạn thành công')
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
    onError: (error: Error) => {
      toast.error('Tạo khách sạn thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateHotelCommand) => {
      const result = await getZaloMiniAppHotelsAdmin().postApiZaloMiniAppAdminHotelsUpdate(data)
      if (!result.success) {
        throw new Error(result.message || 'Cập nhật khách sạn thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Cập nhật khách sạn thành công')
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      queryClient.invalidateQueries({ queryKey: ['hotel'] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật khách sạn thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteHotel = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (publicId: string) => {
      const result = await getZaloMiniAppHotelsAdmin().postApiZaloMiniAppAdminHotelsDelete({ publicId })
      if (!result.success) {
        throw new Error(result.message || 'Xóa khách sạn thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Xóa khách sạn thành công')
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
    },
    onError: (error: Error) => {
      toast.error('Xóa khách sạn thất bại', {
        description: error.message,
      })
    },
  })
}


