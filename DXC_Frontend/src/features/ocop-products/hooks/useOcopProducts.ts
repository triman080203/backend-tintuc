import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ocopProductsApi } from '@/api/ocop-products'
import { getZaloMiniAppOcopCategoriesAdmin } from '@/api/endpoints/zalo-mini-app-ocop-categories-admin'
import { getZaloMiniAppOcopEnterprisesAdmin } from '@/api/endpoints/zalo-mini-app-ocop-enterprises-admin'
import type { CreateOcopProductCommand, UpdateOcopProductCommand, EnumResultOfGuid } from '@/api/models'

export const useOcopProducts = (params?: {
  Current?: number
  PageSize?: number
  searchTerm?: string
  categoryPublicId?: string
  enterprisePublicId?: string
  minPrice?: number
  maxPrice?: number
}) => {
  return useQuery({
    queryKey: ['ocop-products', params],
    queryFn: () => ocopProductsApi.getApiZaloMiniAppAdminOcopProducts({
      Current: params?.Current || 1,
      PageSize: params?.PageSize || 10,
      Name: params?.searchTerm,
      CategoryPublicId: params?.categoryPublicId,
      EnterprisePublicId: params?.enterprisePublicId,
      MinPrice: params?.minPrice,
      MaxPrice: params?.maxPrice,
    }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useOcopProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['ocop-product', id],
    queryFn: () => ocopProductsApi.getApiZaloMiniAppAdminOcopProductsPublicId(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useOcopCategoryEnums = () => {
  return useQuery({
    queryKey: ['ocop-category-enums'],
    queryFn: async () => {
      const api = getZaloMiniAppOcopCategoriesAdmin()
      const response = await api.getApiZaloMiniAppAdminOcopCategoriesEnumAll()
      return (response?.data || []) as EnumResultOfGuid[]
    },
    staleTime: 30 * 60 * 1000,
  })
}

export const useOcopEnterpriseEnums = () => {
  return useQuery({
    queryKey: ['ocop-enterprise-enums'],
    queryFn: async () => {
      const api = getZaloMiniAppOcopEnterprisesAdmin()
      const response = await api.getApiZaloMiniAppAdminOcopEnterprisesEnumAll()
      return (response?.data || []) as EnumResultOfGuid[]
    },
    staleTime: 30 * 60 * 1000,
  })
}

export const useCreateOcopProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOcopProductCommand) =>
      ocopProductsApi.postApiZaloMiniAppAdminOcopProductsCreate(data),
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-products'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi tạo sản phẩm')
    },
  })
}

export const useUpdateOcopProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateOcopProductCommand) =>
      ocopProductsApi.postApiZaloMiniAppAdminOcopProductsUpdate(data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-products'] })
      queryClient.invalidateQueries({ queryKey: ['ocop-product', variables.publicId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi cập nhật sản phẩm')
    },
  })
}

export const useDeleteOcopProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicId: string) =>
      ocopProductsApi.postApiZaloMiniAppAdminOcopProductsDelete({ publicId }),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['ocop-products'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Lỗi khi xóa sản phẩm')
    },
  })
}
