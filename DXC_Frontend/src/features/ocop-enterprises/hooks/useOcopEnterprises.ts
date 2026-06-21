import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ocopEnterprisesApi } from '@/api/ocop-enterprises'
import type { CreateOcopEnterpriseCommand, UpdateOcopEnterpriseCommand } from '@/api/models'

export const useOcopEnterprises = (params?: {
  Current?: number
  PageSize?: number
  searchTerm?: string
}) => {
  return useQuery({
    queryKey: ['ocop-enterprises', params],
    queryFn: () => ocopEnterprisesApi.getApiZaloMiniAppAdminOcopEnterprises({
      Current: params?.Current || 1,
      PageSize: params?.PageSize || 10,
      Name: params?.searchTerm,
    }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useOcopEnterpriseDetail = (id: string) => {
  return useQuery({
    queryKey: ['ocop-enterprise', id],
    queryFn: () => ocopEnterprisesApi.getApiZaloMiniAppAdminOcopEnterprisesPublicId(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateOcopEnterprise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOcopEnterpriseCommand) =>
      ocopEnterprisesApi.postApiZaloMiniAppAdminOcopEnterprisesCreate(data),
    onSuccess: () => {
      toast.success('Tạo doanh nghiệp thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-enterprises'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo doanh nghiệp')
    },
  })
}

export const useUpdateOcopEnterprise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateOcopEnterpriseCommand) =>
      ocopEnterprisesApi.postApiZaloMiniAppAdminOcopEnterprisesUpdate(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật doanh nghiệp thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-enterprises'] })
      queryClient.invalidateQueries({ queryKey: ['ocop-enterprise', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi cập nhật doanh nghiệp')
    },
  })
}

export const useDeleteOcopEnterprise = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) =>
      ocopEnterprisesApi.postApiZaloMiniAppAdminOcopEnterprisesDelete({ publicId }),
    onSuccess: () => {
      toast.success('Xóa doanh nghiệp thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-enterprises'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi xóa doanh nghiệp')
    },
  })
}
