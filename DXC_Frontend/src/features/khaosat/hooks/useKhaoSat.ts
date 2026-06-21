import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getKhaoSatAdminApi } from '@/api/zalo-mini-app-khaosat-admin'
import type {
  GetApiZaloMiniAppAdminKhaosatParams,
  CreateSurveyCommand,
  UpdateSurveyCommand,
  DeleteSurveyCommand,
} from '@/api/models'
import type { InsertQuestionCommand } from '@/api/models/insertQuestionCommand'
import type { UpdateQuestionCommand } from '@/api/models/updateQuestionCommand'
import type { DeleteQuestionCommand } from '@/api/models/deleteQuestionCommand'
import type { InsertAnswerCommand } from '@/api/models/insertAnswerCommand'
import type { UpdateAnswerCommand } from '@/api/models/updateAnswerCommand'
import type { DeleteAnswerCommand } from '@/api/models/deleteAnswerCommand'
import type { CreateEssayQuestionCommand } from '@/api/models/createEssayQuestionCommand'
import type { UpdateEssayQuestionCommand } from '@/api/models/updateEssayQuestionCommand'
import type { DeleteEssayQuestionCommand } from '@/api/models/deleteEssayQuestionCommand'
import type { PagedResultOfEssayQuestionDto } from '@/api/models/pagedResultOfEssayQuestionDto'

export const useKhaoSatList = (params?: GetApiZaloMiniAppAdminKhaosatParams) => {
  return useQuery({
    queryKey: ['khaosat', params],
    queryFn: () => getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosat(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useKhaoSatDetail = (id: number) => {
  return useQuery({
    queryKey: ['khaosat-detail', id],
    queryFn: async () => {
      const response = await getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosatId(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export const useCreateKhaoSat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSurveyCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatCreate(data)
      if (!result.success) {
        throw new Error(result.message || 'Tạo khảo sát thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Tạo khảo sát thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat'] })
    },
    onError: (error: Error) => {
      toast.error('Tạo khảo sát thất bại', { description: error.message })
    },
  })
}

export const useUpdateKhaoSat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateSurveyCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatUpdate(data)
      if (!result.success) {
        throw new Error(result.message || 'Cập nhật khảo sát thất bại')
      }
      return result
    },
    onSuccess: (_res, variables) => {
      toast.success('Cập nhật khảo sát thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat'] })
      if ((variables as UpdateSurveyCommand)?.id) {
        queryClient.invalidateQueries({ queryKey: ['khaosat-detail', (variables as UpdateSurveyCommand).id] })
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật khảo sát thất bại', { description: error.message })
    },
  })
}

export const useDeleteKhaoSat = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const payload: DeleteSurveyCommand = { id: id }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatDelete(payload)
      if (!result.success) {
        throw new Error(result.message || 'Xóa khảo sát thất bại')
      }
      return result
    },
    onSuccess: () => {
      toast.success('Xóa khảo sát thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat'] })
    },
    onError: (error: Error) => {
      toast.error('Xóa khảo sát thất bại', { description: error.message })
    },
  })
}

export const useInsertQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<InsertQuestionCommand, 'surveyId'>) => {
      const payload: InsertQuestionCommand = { surveyId: surveyId, ...data }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatQuestionsCreate(payload)
      if (!result.success) throw new Error(result.message || 'Thêm câu hỏi thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Thêm câu hỏi thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Thêm câu hỏi thất bại', { description: error.message })
    },
  })
}

export const useUpdateQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateQuestionCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatQuestionsUpdate(data)
      if (!result.success) throw new Error(result.message || 'Cập nhật câu hỏi thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Cập nhật câu hỏi thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật câu hỏi thất bại', { description: error.message })
    },
  })
}

export const useDeleteQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const payload: DeleteQuestionCommand = { id: id }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatQuestionsDelete(payload)
      if (!result.success) throw new Error(result.message || 'Xóa câu hỏi thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Xóa câu hỏi thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Xóa câu hỏi thất bại', { description: error.message })
    },
  })
}

export const useInsertAnswer = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: InsertAnswerCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatAnswersCreate(data)
      if (!result.success) throw new Error(result.message || 'Thêm trả lời thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Thêm trả lời thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Thêm trả lời thất bại', { description: error.message })
    },
  })
}

export const useUpdateAnswer = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateAnswerCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatAnswersUpdate(data)
      if (!result.success) throw new Error(result.message || 'Cập nhật trả lời thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Cập nhật trả lời thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật trả lời thất bại', { description: error.message })
    },
  })
}

export const useDeleteAnswer = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const payload: DeleteAnswerCommand = { id: id }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatAnswersDelete(payload)
      if (!result.success) throw new Error(result.message || 'Xóa trả lời thất bại')
      return result
    },
    onSuccess: () => {
      toast.success('Xóa trả lời thành công')
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
    },
    onError: (error: Error) => {
      toast.error('Xóa trả lời thất bại', { description: error.message })
    },
  })
}

export const useEssayQuestions = (params: { SurveyId: number; Current?: number; PageSize?: number }) => {
  return useQuery<PagedResultOfEssayQuestionDto>({
    queryKey: ['khaosat-essay', params],
    queryFn: () => getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosatTuluan(params),
    staleTime: 1000 * 60,
  })
}

export const useCreateEssayQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<CreateEssayQuestionCommand, 'surveyId'>) => {
      const payload: CreateEssayQuestionCommand = { surveyId: surveyId, ...data }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatTuluanCreate(payload)
      if (!result.success) throw new Error((result as any).message || 'Tạo câu hỏi tự luận thất bại')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khaosat-essay'] })
      toast.success('Tạo câu hỏi tự luận thành công')
    },
    onError: (error: Error) => {
      toast.error('Tạo câu hỏi tự luận thất bại', { description: error.message })
    },
  })
}

export const useUpdateEssayQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateEssayQuestionCommand) => {
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatTuluanUpdate(data)
      if (!result.success) throw new Error((result as any).message || 'Cập nhật câu hỏi tự luận thất bại')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khaosat-essay'] })
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
      toast.success('Cập nhật câu hỏi tự luận thành công')
    },
    onError: (error: Error) => {
      toast.error('Cập nhật câu hỏi tự luận thất bại', { description: error.message })
    },
  })
}

export const useDeleteEssayQuestion = (surveyId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const payload: DeleteEssayQuestionCommand = { id: id }
      const result = await getKhaoSatAdminApi().postApiZaloMiniAppAdminKhaosatTuluanDelete(payload)
      if (!result.success) throw new Error((result as any).message || 'Xóa câu hỏi tự luận thất bại')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khaosat-essay'] })
      queryClient.invalidateQueries({ queryKey: ['khaosat-detail', surveyId] })
      toast.success('Xóa câu hỏi tự luận thành công')
    },
    onError: (error: Error) => {
      toast.error('Xóa câu hỏi tự luận thất bại', { description: error.message })
    },
  })
}
