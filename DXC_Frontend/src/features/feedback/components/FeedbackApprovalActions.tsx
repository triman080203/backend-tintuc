import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, Loader2 } from 'lucide-react'
import {
  approveFeedbackResponseSchema,
  rejectFeedbackResponseSchema,
  type ApproveFeedbackResponseFormData,
  type RejectFeedbackResponseFormData,
} from '../schemas'
import type { FeedbackResponseDto } from '@/api/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FeedbackAttachments from './FeedbackAttachments'

interface FeedbackApprovalActionsProps {
  response: FeedbackResponseDto
  onApprove: (data: ApproveFeedbackResponseFormData & { responseId: number; isApproved: boolean }) => void
  onReject: (data: RejectFeedbackResponseFormData & { responseId: number }) => void
  isSubmitting?: boolean
}

const FeedbackApprovalActions = ({
  response,
  onApprove,
  onReject,
  isSubmitting = false,
}: FeedbackApprovalActionsProps) => {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const approveForm = useForm<ApproveFeedbackResponseFormData>({
    resolver: zodResolver(approveFeedbackResponseSchema),
    defaultValues: {
      approvalNote: '',
    },
  })

  const rejectForm = useForm<RejectFeedbackResponseFormData>({
    resolver: zodResolver(rejectFeedbackResponseSchema),
    defaultValues: {
      rejectionNote: '',
    },
  })

  const handleApprove = (data: ApproveFeedbackResponseFormData) => {
    onApprove({
      ...data,
      responseId: response.id!,
      isApproved: true,
    })
    setApproveDialogOpen(false)
    approveForm.reset()
  }

  const handleReject = (data: RejectFeedbackResponseFormData) => {
    onReject({
      ...data,
      responseId: response.id!,
    })
    setRejectDialogOpen(false)
    rejectForm.reset()
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('vi-VN')
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phản hồi từ phòng ban</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Phòng ban:</p>
            <p className="text-sm">{response.departmentName || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Nội dung phản hồi:</p>
            <p className="text-sm whitespace-pre-wrap">
              {response.responseContent || 'Không có nội dung'}
            </p>
          </div>

          {response.attachments && response.attachments.length > 0 && (
            <FeedbackAttachments
              attachments={response.attachments}
              title="Tài liệu đính kèm"
            />
          )}

          <div>
            <p className="text-sm font-medium mb-2">Thời gian gửi:</p>
            <p className="text-sm text-muted-foreground">{formatDate(response.createdAt)}</p>
          </div>

          {response.isApproved === null && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setApproveDialogOpen(true)}
                className="flex-1"
                disabled={isSubmitting}
              >
                <Check className="mr-2 h-4 w-4" />
                Phê duyệt
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Từ chối
              </Button>
            </div>
          )}

          {response.isApproved === true && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                ✓ Đã phê duyệt
              </p>
              {response.approvalNote && (
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  {response.approvalNote}
                </p>
              )}
              <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                Phê duyệt lúc: {formatDate(response.approvedAt)}
              </p>
            </div>
          )}

          {response.isApproved === false && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                ✗ Đã từ chối
              </p>
              {response.approvalNote && (
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {response.approvalNote}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phê duyệt phản hồi</DialogTitle>
            <DialogDescription>
              Xác nhận phê duyệt phản hồi này. Phản hồi sẽ được công khai sau khi phê duyệt.
            </DialogDescription>
          </DialogHeader>

          <Form {...approveForm}>
            <form onSubmit={approveForm.handleSubmit(handleApprove)} className="space-y-4">
              <FormField
                control={approveForm.control}
                name="approvalNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú phê duyệt (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú nếu cần..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApproveDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận phê duyệt
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối phản hồi</DialogTitle>
            <DialogDescription>
              Phản hồi sẽ được trả lại cho phòng ban để chỉnh sửa. Vui lòng nhập lý do từ chối.
            </DialogDescription>
          </DialogHeader>

          <Form {...rejectForm}>
            <form onSubmit={rejectForm.handleSubmit(handleReject)} className="space-y-4">
              <FormField
                control={rejectForm.control}
                name="rejectionNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lý do từ chối <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập lý do từ chối..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRejectDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận từ chối
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FeedbackApprovalActions
