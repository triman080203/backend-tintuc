import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCommonAdmin } from '@/api/endpoints/common-admin'
import type { GetApiAdminCommonDepartmentsParams, DeleteDepartmentCommand, GetApiAdminCommonDepartmentsDepartmentPublicIdUsersParams } from '@/api/models'

export const useDepartments = (params?: { Current?: number; PageSize?: number; Name?: string; IsActive?: boolean }) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => getCommonAdmin().getApiAdminCommonDepartments(params as GetApiAdminCommonDepartmentsParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      name?: string | null
      code?: string | null
      description?: string | null
      contactEmail?: string | null
      contactPhone?: string | null
      organizationPublicId?: string
    }) => getCommonAdmin().postApiAdminCommonDepartmentsCreate({
      organizationPublicId: data.organizationPublicId || '',
      code: data.code || null,
      name: data.name || null,
      description: data.description || null,

    }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Tạo phòng ban thành công')
        queryClient.invalidateQueries({ queryKey: ['departments'] })
      } else {
        toast.error('Tạo phòng ban thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo phòng ban thất bại', {
        description: error.message,
      })
    },
  })
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      publicId: string
      name?: string | null
      code?: string | null
      description?: string | null
      contactEmail?: string | null
      contactPhone?: string | null
      organizationPublicId?: string
    }) => getCommonAdmin().postApiAdminCommonDepartmentsUpdate({
      publicId: data.publicId,
      code: data.code || null,
      name: data.name || null,
      description: data.description || null,

    }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Cập nhật phòng ban thành công')
        queryClient.invalidateQueries({ queryKey: ['departments'] })
      } else {
        toast.error('Cập nhật phòng ban thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật phòng ban thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (publicId: string) => 
      getCommonAdmin().postApiAdminCommonDepartmentsDelete({
        publicId,
      } as DeleteDepartmentCommand),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Xóa phòng ban thành công')
        queryClient.invalidateQueries({ queryKey: ['departments'] })
      } else {
        toast.error('Xóa phòng ban thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa phòng ban thất bại', {
        description: error.message,
      })
    },
  })
}

export const useAssignUserToDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userPublicId: string; departmentPublicId: string }) =>
      getCommonAdmin().postApiAdminCommonDepartmentsUsersAssign({
        userPublicId: data.userPublicId,
        departmentPublicId: data.departmentPublicId,
      }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Gán người dùng vào phòng ban thành công')
        queryClient.invalidateQueries({ queryKey: ['department-users'] })
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error('Gán người dùng thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Gán người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useRemoveUserFromDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userPublicId: string; departmentPublicId: string }) =>
      getCommonAdmin().postApiAdminCommonDepartmentsUsersRemove({
        userPublicId: data.userPublicId,
        departmentPublicId: data.departmentPublicId,
      }),
    onSuccess: (result) => {
      if (result?.success) {
        toast.success('Xóa người dùng khỏi phòng ban thành công')
        queryClient.invalidateQueries({ queryKey: ['department-users'] })
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error('Xóa người dùng thất bại', {
          description: result?.message,
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa người dùng thất bại', {
        description: error.message,
      })
    },
  })
}

export const useDepartmentUsers = (
  departmentPublicId: string,
  params?: Omit<GetApiAdminCommonDepartmentsDepartmentPublicIdUsersParams, 'DepartmentPublicId'>
) => {
  return useQuery({
    queryKey: ['department-users', departmentPublicId, params],
    queryFn: () =>
      getCommonAdmin().getApiAdminCommonDepartmentsDepartmentPublicIdUsers(
        departmentPublicId,
        {
          ...params,
          DepartmentPublicId: departmentPublicId,
        } as GetApiAdminCommonDepartmentsDepartmentPublicIdUsersParams
      ),
    enabled: !!departmentPublicId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
