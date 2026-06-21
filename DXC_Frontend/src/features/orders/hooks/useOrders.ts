import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppOrdersAdmin } from '@/api/endpoints/zalo-mini-app-orders-admin'
import type {
  GetApiZaloMiniAppAdminOrdersParams,
  UpdateOrderCommand,
  DeleteOrderCommand,
} from '@/api/models'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: GetApiZaloMiniAppAdminOrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

export const useOrders = (params: GetApiZaloMiniAppAdminOrdersParams = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getZaloMiniAppOrdersAdmin().getApiZaloMiniAppAdminOrders(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useOrderDetail = (publicId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(publicId),
    queryFn: () => getZaloMiniAppOrdersAdmin().getApiZaloMiniAppAdminOrdersPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateOrderCommand) =>
      getZaloMiniAppOrdersAdmin().postApiZaloMiniAppAdminOrdersUpdate(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật đơn hàng thành công')
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
        if (variables.publicId) {
          queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.publicId) })
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật đơn hàng thất bại')
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteOrderCommand) =>
      getZaloMiniAppOrdersAdmin().postApiZaloMiniAppAdminOrdersDelete(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa đơn hàng thành công')
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa đơn hàng thất bại')
    },
  })
}
