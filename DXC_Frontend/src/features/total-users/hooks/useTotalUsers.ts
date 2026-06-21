import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customRequest } from '@/api/request'
import type { TotalUserFormData, TotalUserTableRow } from '../types'

interface ListParams {
  Current: number
  PageSize: number
 Search?: string
  PhoneNumber?: string
}

interface PagedResult<T> {
  success: boolean
  data: T[]
  total: number
  current: number
  pageSize: number
  message?: string
}

interface ApiResult<T> {
  success: boolean
  data?: T
  message?: string
}

const endpointBase = '/api/zalo-mini-app/admin/user/total-users'

export const useTotalUsers = (params: ListParams) => {
  const { Current, PageSize, Search, PhoneNumber } = params
 return useQuery<PagedResult<TotalUserTableRow>>({
    queryKey: ['total-users', Current, PageSize, Search, PhoneNumber],
    queryFn: async () => {
      const response = await customRequest<PagedResult<TotalUserTableRow>>({
        url: endpointBase,
        method: 'GET',
        params: {
          Current,
          PageSize,
          Search: Search || undefined,
          PhoneNumber: PhoneNumber || undefined,
        },
      });
      
      // Cập nhật dữ liệu để thêm trường phoneNumber nếu không có
      const updatedData = response.data.map(item => ({
        ...item,
        phoneNumber: item.phoneNumber || null
      }));
      
      return {
        ...response,
        data: updatedData
      };
    },
    staleTime: 1000 * 60 * 5,
  })
}

export const useTotalUserDetail = (id: number | string) => {
  return useQuery<ApiResult<TotalUserTableRow>>({
    queryKey: ['total-user', id],
    queryFn: async () => {
      const response = await customRequest<ApiResult<TotalUserTableRow>>({
        url: `${endpointBase}/${id}`,
        method: 'GET',
      });
      
      // Cập nhật dữ liệu để thêm trường phoneNumber nếu không có
      if (response.data) {
        response.data = {
          ...response.data,
          phoneNumber: response.data.phoneNumber || null
        };
      }
      
      return response;
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}

export const useCreateTotalUser = () => {
  const qc = useQueryClient()
  return useMutation<ApiResult<TotalUserTableRow>, Error, TotalUserFormData>({
    mutationFn: (payload) => customRequest<ApiResult<TotalUserTableRow>>({
      url: `${endpointBase}/create`,
      method: 'POST',
      data: {
        userId: payload.userId,
        username: payload.username,
        avatar: payload.avatar || null,
        phanQuyen: payload.phanQuyen ? 'true' : 'false',
        phoneNumber: payload.phoneNumber || null,
      },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['total-users'] })
    },
  })
}

export const useUpdateTotalUser = () => {
  const qc = useQueryClient()
  return useMutation<ApiResult<TotalUserTableRow>, Error, TotalUserTableRow>({
    mutationFn: (payload) => customRequest<ApiResult<TotalUserTableRow>>({
      url: `${endpointBase}/update`,
      method: 'POST',
      data: {
        id: payload.id,
        userId: payload.userId,
        username: payload.username,
        avatar: payload.avatar || null,
        phanQuyen: (payload.phanQuyen ?? '').toString(),
        phoneNumber: payload.phoneNumber || null,
      },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['total-users'] })
    },
  })
}

export const useDeleteTotalUser = () => {
  const qc = useQueryClient()
  return useMutation<ApiResult<unknown>, Error, number>({
    mutationFn: (id) => customRequest<ApiResult<unknown>>({
      url: `${endpointBase}/delete`,
      method: 'POST',
      data: { id },
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['total-users'] })
    },
  })
}
