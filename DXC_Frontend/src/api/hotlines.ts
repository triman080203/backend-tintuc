import { getHotlinesAdmin } from '@/api/endpoints/hotlines-admin'
import type {
  CreateHotlineCommand,
  UpdateHotlineCommand,
  DeleteHotlineCommand,
  GetApiZaloMiniAppAdminServicesHotlinesParams,
} from '@/api/models'

const api = getHotlinesAdmin()

export const hotlineApi = {
  list: (params?: GetApiZaloMiniAppAdminServicesHotlinesParams) =>
    api.getApiZaloMiniAppAdminServicesHotlines(params),
  detail: (publicId: string) =>
    api.getApiZaloMiniAppAdminServicesHotlinesPublicId(publicId),
  create: (data: CreateHotlineCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesCreate(data),
  update: (data: UpdateHotlineCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesUpdate(data),
  delete: (data: DeleteHotlineCommand) =>
    api.postApiZaloMiniAppAdminServicesHotlinesDelete(data),
}
