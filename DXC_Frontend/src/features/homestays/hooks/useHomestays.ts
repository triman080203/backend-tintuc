import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getHomestaysAdmin } from '@/api/endpoints/homestays-admin'
import type {
  GetApiZaloMiniAppAdminHomestaysParams,
  CreateHomestayCommand,
  UpdateHomestayCommand,
  DeleteHomestayCommand,
} from '@/api/models'

// Query Keys
export const homestayKeys = {
  all: ['homestays'] as const,
  lists: () => [...homestayKeys.all, 'list'] as const,
  list: (params: GetApiZaloMiniAppAdminHomestaysParams) => [...homestayKeys.lists(), params] as const,
  details: () => [...homestayKeys.all, 'detail'] as const,
  detail: (id: string) => [...homestayKeys.details(), id] as const,
}

// List Homestays Hook
export const useHomestays = (params: GetApiZaloMiniAppAdminHomestaysParams = {}) => {
  return useQuery({
    queryKey: homestayKeys.list(params),
    queryFn: () => getHomestaysAdmin().getApiZaloMiniAppAdminHomestays(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get Homestay Detail Hook
export const useHomestayDetail = (publicId: string) => {
  return useQuery({
    queryKey: homestayKeys.detail(publicId),
    queryFn: () => getHomestaysAdmin().getApiZaloMiniAppAdminHomestaysPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Create Homestay Hook
export const useCreateHomestay = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHomestayCommand) =>
      getHomestaysAdmin().postApiZaloMiniAppAdminHomestaysCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo homestay thành công')
        // Invalidate and refetch homestays list
        queryClient.invalidateQueries({ queryKey: homestayKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Tạo homestay thất bại')
    },
  })
}

// Update Homestay Hook
export const useUpdateHomestay = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateHomestayCommand) =>
      getHomestaysAdmin().postApiZaloMiniAppAdminHomestaysUpdate(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật homestay thành công')
        // Invalidate specific homestay and lists
        queryClient.invalidateQueries({ queryKey: homestayKeys.lists() })
        if (variables.publicId) {
          queryClient.invalidateQueries({ queryKey: homestayKeys.detail(variables.publicId) })
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật homestay thất bại')
    },
  })
}

// Delete Homestay Hook
export const useDeleteHomestay = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteHomestayCommand) =>
      getHomestaysAdmin().postApiZaloMiniAppAdminHomestaysDelete(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa homestay thành công')
        // Invalidate homestays list
        queryClient.invalidateQueries({ queryKey: homestayKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa homestay thất bại')
    },
  })
}