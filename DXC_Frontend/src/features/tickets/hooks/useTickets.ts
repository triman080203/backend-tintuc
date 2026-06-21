import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getZaloMiniAppTicketsAdmin } from '@/api/endpoints/zalo-mini-app-tickets-admin'
import type {
  GetApiZaloMiniAppAdminTicketsParams,
  CreateTicketCommand,
  UpdateTicketCommand,
  DeleteTicketCommand,
} from '@/api/models'

export const TicketKeys = {
  all: ['Tickets'] as const,
  lists: () => [...TicketKeys.all, 'list'] as const,
  list: (params: GetApiZaloMiniAppAdminTicketsParams) => [...TicketKeys.lists(), params] as const,
  details: () => [...TicketKeys.all, 'detail'] as const,
  detail: (id: string) => [...TicketKeys.details(), id] as const,
}

export const useTickets = (params: GetApiZaloMiniAppAdminTicketsParams = {}) => {
  return useQuery({
    queryKey: TicketKeys.list(params),
    queryFn: () => getZaloMiniAppTicketsAdmin().getApiZaloMiniAppAdminTickets(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useTicketDetail = (publicId: string) => {
  return useQuery({
    queryKey: TicketKeys.detail(publicId),
    queryFn: () => getZaloMiniAppTicketsAdmin().getApiZaloMiniAppAdminTicketsPublicId(publicId),
    enabled: !!publicId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTicketCommand) =>
      getZaloMiniAppTicketsAdmin().postApiZaloMiniAppAdminTicketsCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo vé thành công')
        queryClient.invalidateQueries({ queryKey: TicketKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Tạo vé thất bại')
    },
  })
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTicketCommand) =>
      getZaloMiniAppTicketsAdmin().postApiZaloMiniAppAdminTicketsUpdate(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success('Cập nhật vé thành công')
        queryClient.invalidateQueries({ queryKey: TicketKeys.lists() })
        if (variables.publicId) {
          queryClient.invalidateQueries({ queryKey: TicketKeys.detail(variables.publicId) })
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật vé thất bại')
    },
  })
}

export const useDeleteTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteTicketCommand) =>
      getZaloMiniAppTicketsAdmin().postApiZaloMiniAppAdminTicketsDelete(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Xóa vé thành công')
        queryClient.invalidateQueries({ queryKey: TicketKeys.lists() })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Xóa vé thất bại')
    },
  })
}
