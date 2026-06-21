import { getHotlinesAdmin } from '@/api/endpoints/hotlines-admin'
import type {
  CreateHotlineCategoryCommand,
  UpdateHotlineCategoryCommand,
  DeleteHotlineCategoryCommand,
  GetApiZaloMiniAppAdminServicesHotlinesCategoriesParams,
} from '@/api/models'

const api = getHotlinesAdmin()

export const hotlineCategoryApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesHotlinesCategoriesParams) =>
    api.getApiZaloMiniAppAdminServicesHotlinesCategories(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesHotlinesCategoriesPublicId(publicId),
  create: (data: CreateHotlineCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesCategoriesCreate(data),
  update: (data: UpdateHotlineCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesCategoriesUpdate(data),
  delete: (data: DeleteHotlineCategoryCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesCategoriesDelete(data),
}
