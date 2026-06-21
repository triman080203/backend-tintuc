import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCommonAdmin } from '@/api/endpoints/common-admin'
import type { GetApiAdminCommonOrganizationsParams, DeleteOrganizationCommand } from '@/api/models'

export const useOrganizations = (params?: GetApiAdminCommonOrganizationsParams) => {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => getCommonAdmin().getApiAdminCommonOrganizations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      name?: string | null
      code?: string | null
      description?: string | null
    }) => getCommonAdmin().postApiAdminCommonOrganizationsCreate({
      code: data.code || null,
      name: data.name || null,
      description: data.description || null,
    }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Tạo tổ chức thành công')
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
      } else {
        toast.error('Tạo tổ chức thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo tổ chức thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      publicId: string
      name?: string | null
      code?: string | null
      description?: string | null
    }) => getCommonAdmin().postApiAdminCommonOrganizationsUpdate({
      publicId: data.publicId,
      code: data.code || null,
      name: data.name || null,
      description: data.description || null,
    }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Cập nhật tổ chức thành công')
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
      } else {
        toast.error('Cập nhật tổ chức thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật tổ chức thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (publicId: string) => 
      getCommonAdmin().postApiAdminCommonOrganizationsDelete({
        publicId,
      } as DeleteOrganizationCommand),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Xóa tổ chức thành công')
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
      } else {
        toast.error('Xóa tổ chức thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa tổ chức thất bại', {
        description: error.message,
      })
    },
  })
}
