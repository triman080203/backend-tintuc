import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Check, Send, CheckCircle, XCircle, Globe, Archive, Trash2 } from 'lucide-react'
import { TinTucForm, TinTucStatusBadge, TinTucWorkflowDialog, TinTucTimeline, type WorkflowActionCode } from '../components'
import { useTinTucDetail } from '../hooks'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { TinTucFormData } from '../schemas'

const TinTucUpdatePage = () => {
  const { id: publicId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const submitRef = useRef<(() => void) | null>(null)

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<WorkflowActionCode>('submit')

  const { data, isLoading } = useTinTucDetail(publicId || '')
  const detail = data?.data

  const updateMutation = useMutation({
    mutationFn: (formData: TinTucFormData) =>
      getTinTucAdmin().putApiAdminTintucPublicId(publicId!, {
        publicId: publicId!,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        thumbnailUrl: formData.thumbnailUrl,
        categoryId: formData.categoryId,
        tags: formData.tags,
        authorName: formData.authorName,
        attachmentPublicIds: formData.attachmentPublicIds,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Cập nhật tin bài thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-list'] })
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-detail', publicId] })
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: (error: unknown) => {
      const err = error as any
      const message = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      toast.error(message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => getTinTucAdmin().deleteApiAdminTintucPublicId(publicId!),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Xóa tin bài thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-list'] })
        navigate('/tin-tuc')
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa tin bài')
    },
  })

  const handleSubmit = (formData: TinTucFormData) => {
    updateMutation.mutate(formData)
  }

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin bài này?')) {
      deleteMutation.mutate()
    }
  }

  const handleWorkflow = (action: WorkflowActionCode) => {
    setCurrentAction(action)
    setWorkflowDialogOpen(true)
  }

  const canEdit = detail?.currentStatusCode === 'draft' || detail?.currentStatusCode === 'returned'
  const isPending = detail?.currentStatusCode === 'pending'
  const isApproved = detail?.currentStatusCode === 'approved'
  const isPublished = detail?.currentStatusCode === 'published'

  if (isLoading) return <div>Đang tải...</div>
  if (!detail) return <div>Không tìm thấy dữ liệu</div>

  return (
    <>
      <FormPageLayout
        title="Chi tiết tin bài"
        description="Xem và quản lý thông tin bài viết"
        formTitle="Thông tin bài viết"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', href: '/tin-tuc' },
          { label: 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tin-tuc')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            <ActionBarDivider />

            {/* Trạng thái hiện tại */}
            <div className="mr-2 flex items-center">
              <TinTucStatusBadge
                statusCode={detail.currentStatusCode}
                statusName={detail.currentStatusName}
                statusColor={detail.currentStatusColor}
              />
            </div>

            <ActionBarDivider />

            {/* Các action workflow */}
            {canEdit && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleWorkflow('submit')} className="gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  Gửi duyệt
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </>
            )}

            {isPending && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleWorkflow('approve')} className="gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Phê duyệt
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleWorkflow('return')} className="gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Trả lại
                </Button>
              </>
            )}

            {isApproved && (
              <>
                <Button variant="ghost" size="sm" onClick={() => handleWorkflow('publish')} className="gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Xuất bản
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleWorkflow('return')} className="gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Trả lại
                </Button>
              </>
            )}

            {isPublished && (
              <Button variant="ghost" size="sm" onClick={() => handleWorkflow('archive')} className="gap-2">
                <Archive className="w-4 h-4 text-gray-600" />
                Lưu trữ
              </Button>
            )}

            {canEdit && (
              <Button variant="ghost" size="sm" onClick={handleDelete} className="gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                Xóa
              </Button>
            )}
          </>
        }
      >
        <div className="bg-card border rounded-lg p-6 max-w-[800px] mx-auto">
          <TinTucForm
            initialData={detail}
            onSubmit={handleSubmit}
            isEdit={true}
            onSave={(submit) => {
              submitRef.current = submit
            }}
          />
        </div>
        
        <div className="mt-6 max-w-[800px] mx-auto">
          <TinTucTimeline processings={detail.processingHistories} />
        </div>
      </FormPageLayout>

      <TinTucWorkflowDialog
        open={workflowDialogOpen}
        onOpenChange={setWorkflowDialogOpen}
        publicId={publicId}
        actionCode={currentAction}
      />
    </>
  )
}

export default TinTucUpdatePage
