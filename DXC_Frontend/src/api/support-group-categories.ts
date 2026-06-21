import { getSupportGroupsAdmin } from '@/api/endpoints/support-groups-admin'
import type {
  CreateSupportGroupCategoryCommand,
  UpdateSupportGroupCategoryCommand,
  DeleteSupportGroupCategoryCommand,
  GetApiZaloMiniAppAdminServicesSupportGroupsCategoriesParams,
} from '@/api/models'

const api = getSupportGroupsAdmin()

export const supportGroupCategoryApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesSupportGroupsCategoriesParams) =>
    api.getApiZaloMiniAppAdminServicesSupportGroupsCategories(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesSupportGroupsCategoriesPublicId(publicId),
  create: (data: CreateSupportGroupCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsCategoriesCreate(data),
  update: (data: UpdateSupportGroupCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsCategoriesUpdate(data),
  delete: (data: DeleteSupportGroupCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsCategoriesDelete(data),
}