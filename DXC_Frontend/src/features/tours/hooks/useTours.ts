import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppToursAdmin } from '@/api/endpoints/zalo-mini-app-tours-admin'
import type {
  GetApiZaloMiniAppAdminToursParams,
  CreateTourCommand,
  UpdateTourCommand,
  DeleteTourCommand,
} from '@/api/models'

export const tourKeys = {
  all: ['tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (params: GetApiZaloMiniAppAdminToursParams) => [...tourKeys.lists(), params] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
}

export const useTours = (params: GetApiZaloMiniAppAdminToursParams = {}) => {
  return useQuery({
    queryKey: tourKeys.list(params),
    queryFn: () => getZaloMiniAppToursAdmin().getApiZaloMiniAppAdminTours(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useTourDetail = (publicId: string) => {
  return useQuery({
    queryKey: tourKeys.detail(publicId),
    queryFn: () => getZaloMiniAppToursAdmin().getApiZaloMiniAppAdminToursPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateTour = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTourCommand) =>
      getZaloMiniAppToursAdmin().postApiZaloMiniAppAdminToursCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo tour thành công')
        queryClient.invalidateQueries({ queryKey: tourKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Tạo tour thất bại')
    },
  })
}

export const useUpdateTour = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTourCommand) =>
      getZaloMiniAppToursAdmin().postApiZaloMiniAppAdminToursUpdate(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật tour thành công')
        queryClient.invalidateQueries({ queryKey: tourKeys.lists() })
        if (variables.publicId) {
          queryClient.invalidateQueries({ queryKey: tourKeys.detail(variables.publicId) })
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật tour thất bại')
    },
  })
}

export const useDeleteTour = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteTourCommand) =>
      getZaloMiniAppToursAdmin().postApiZaloMiniAppAdminToursDelete(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa tour thành công')
        queryClient.invalidateQueries({ queryKey: tourKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa tour thất bại')
    },
  })
}
