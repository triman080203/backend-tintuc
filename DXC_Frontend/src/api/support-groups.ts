import { getSupportGroupsAdmin } from '@/api/endpoints/support-groups-admin'
import type {
  CreateSupportGroupCommand,
  UpdateSupportGroupCommand,
  DeleteSupportGroupCommand,
  GetApiZaloMiniAppAdminServicesSupportGroupsParams,
} from '@/api/models'

const api = getSupportGroupsAdmin()

export const supportGroupApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesSupportGroupsParams) =>
    api.getApiZaloMiniAppAdminServicesSupportGroups(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesSupportGroupsPublicId(publicId),
  create: (data: CreateSupportGroupCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsCreate(data),
  update: (data: UpdateSupportGroupCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsUpdate(data),
  delete: (data: DeleteSupportGroupCommand) =>
    api.postApiZaloMiniAppAdminServicesSupportGroupsDelete(data),
}
