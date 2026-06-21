import { getIconManagementAdmin } from '@/api/endpoints/icon-management-admin'
import type {
  CreateIconCategoryCommand,
  UpdateIconCategoryCommand,
  DeleteIconCategoryCommand,
  GetApiZaloMiniAppAdminServicesIconCategoriesParams,
} from '@/api/models'

const api = getIconManagementAdmin()

export const iconCategoryApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesIconCategoriesParams) =>
    api.getApiZaloMiniAppAdminServicesIconCategories(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesIconCategoriesPublicId(publicId),
  create: (data: CreateIconCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesIconCategoriesCreate(data),
  update: (data: UpdateIconCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesIconCategoriesUpdate(data),
  delete: (data: DeleteIconCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesIconCategoriesDelete(data),
}
