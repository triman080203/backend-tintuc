import { getIconManagementAdmin } from './endpoints/icon-management-admin'
import type {
  CreateIconGroupCommand,
  UpdateIconGroupCommand,
  GetApiZaloMiniAppAdminServicesIconGroupsParams,
} from './models'

const api = getIconManagementAdmin()

export const iconGroupApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesIconGroupsParams) =>
    api.getApiZaloMiniAppAdminServicesIconGroups(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesIconGroupsPublicId(publicId),
  create: (data: CreateIconGroupCommand) =>
    api.postApiZaloMiniAppAdminServicesIconGroupsCreate(data),
  update: (data: UpdateIconGroupCommand) =>
    api.postApiZaloMiniAppAdminServicesIconGroupsUpdate(data),
  delete: (publicId: string) =>
    api.postApiZaloMiniAppAdminServicesIconGroupsDelete({ publicId }),
}
