import { getIconManagementAdmin } from './endpoints/icon-management-admin'
import type {
  CreateIconCommand,
  UpdateIconCommand,
  GetApiZaloMiniAppAdminServicesIconsParams,
} from './models'

const api = getIconManagementAdmin()

export const iconApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesIconsParams) =>
    api.getApiZaloMiniAppAdminServicesIcons(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesIconsPublicId(publicId),
  create: (data: CreateIconCommand) =>
    api.postApiZaloMiniAppAdminServicesIconsCreate(data),
  update: (data: UpdateIconCommand) =>
    api.postApiZaloMiniAppAdminServicesIconsUpdate(data),
  delete: (publicId: string) =>
    api.postApiZaloMiniAppAdminServicesIconsDelete({ publicId }),
}
