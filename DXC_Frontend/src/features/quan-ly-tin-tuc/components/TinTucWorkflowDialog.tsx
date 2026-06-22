import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import { workflowTinTucSchema, type WorkflowTinTucFormData } from '../schemas'

export type WorkflowActionCode = 'submit' | 'approve' | 'return' | 'publish' | 'archive'

interface TinTucWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  publicId?: string
  actionCode?: WorkflowActionCode
}

const ACTION_MAP: Record<WorkflowActionCode, { title: string; desc: string; button: string }> = {
  submit: {
    title: 'Gửi duyệt bài viết',
    desc: 'Bạn có chắc chắn muốn gửi bài viết này cho biên tập viên kiểm duyệt?',
    button: 'Gửi duyệt',
  },
  approve: {
    title: 'Phê duyệt bài viết',
    desc: 'Bài viết đã đạt yêu cầu và chờ xuất bản?',
    button: 'Phê duyệt',
  },
  return: {
    title: 'Trả lại bài viết',
    desc: 'Trả lại bài viết cho tác giả để chỉnh sửa.',
    button: 'Trả lại',
  },
  publish: {
    title: 'Xuất bản bài viết',
    desc: 'Bài viết sẽ được hiển thị công khai trên ứng dụng Zalo Mini App.',
    button: 'Xuất bản',
  },
  archive: {
    title: 'Lưu trữ bài viết',
    desc: 'Hủy xuất bản và lưu trữ bài viết này.',
    button: 'Lưu trữ',
  },
}

export const TinTucWorkflowDialog = ({
  open,
  onOpenChange,
  publicId,
  actionCode,
}: TinTucWorkflowDialogProps) => {
  const queryClient = useQueryClient()

  const form = useForm<WorkflowTinTucFormData>({
    resolver: zodResolver(workflowTinTucSchema),
    defaultValues: {
      actionCode: actionCode || 'submit',
      note: '',
    },
  })

  // Cập nhật actionCode khi prop thay đổi
  useEffect(() => {
    if (actionCode) {
      form.setValue('actionCode', actionCode)
    }
  }, [actionCode, form])

  // Reset form khi đóng mở
  useEffect(() => {
    if (open) {
      form.reset({
        actionCode: actionCode || 'submit',
        note: '',
      })
    }
  }, [open, actionCode, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: WorkflowTinTucFormData) =>
      getTinTucAdmin().postApiAdminTintucPublicIdWorkflow(publicId!, {
        action: data.actionCode,
        note: data.note || undefined,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Thao tác thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-list'] })
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-detail', publicId] })
        onOpenChange(false)
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      const message = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      toast.error(message)
    },
  })

  const onSubmit = (data: WorkflowTinTucFormData) => {
    if (!publicId) return
    mutate(data)
  }

  const actionInfo = actionCode ? ACTION_MAP[actionCode] : ACTION_MAP.submit
  const isNoteRequired = actionCode === 'return'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionInfo.title}</DialogTitle>
          <DialogDescription>{actionInfo.desc}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ghi chú xử lý {isNoteRequired && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isNoteRequired ? 'Nhập lý do trả lại...' : 'Nhập ghi chú (nếu có)'}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                variant={actionCode === 'return' || actionCode === 'archive' ? 'destructive' : 'default'}
              >
                {isPending ? 'Đang xử lý...' : actionInfo.button}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
