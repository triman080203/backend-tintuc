
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, XCircle } from 'lucide-react'

const feedbackRejectApprovalSchema = z.object({
  rejectionNote: z
    .string()
    .min(1, 'Vui lòng nhập lý do từ chối duyệt')
    .max(500, 'Lý do từ chối không quá 500 ký tự'),
})

type FeedbackRejectApprovalFormData = z.infer<typeof feedbackRejectApprovalSchema>

interface FeedbackRejectApprovalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FeedbackRejectApprovalFormData) => void
  isSubmitting: boolean
}

const FeedbackRejectApprovalForm = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: FeedbackRejectApprovalFormProps) => {
  const form = useForm<FeedbackRejectApprovalFormData>({
    resolver: zodResolver(feedbackRejectApprovalSchema),
    defaultValues: {
      rejectionNote: '',
    },
  })

  const handleSubmit = (data: FeedbackRejectApprovalFormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Từ chối duyệt phản ánh
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn từ chối duyệt phản ánh này không?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do từ chối *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do từ chối duyệt phản ánh..."
                      {...field}
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
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Từ chối duyệt
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackRejectApprovalForm
