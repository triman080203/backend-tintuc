
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
import { Loader2 } from 'lucide-react'

const feedbackApprovalSchema = z.object({
  approvalNote: z
    .string()
    .max(500, 'Ghi chú duyệt không quá 500 ký tự')
    .optional(),
})

type FeedbackApprovalFormData = z.infer<typeof feedbackApprovalSchema>

interface FeedbackApprovalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FeedbackApprovalFormData) => void
  isSubmitting: boolean
}

const FeedbackApprovalForm = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: FeedbackApprovalFormProps) => {
  const form = useForm<FeedbackApprovalFormData>({
    resolver: zodResolver(feedbackApprovalSchema),
    defaultValues: {
      approvalNote: '',
    },
  })

  const handleSubmit = (data: FeedbackApprovalFormData) => {
    onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duyệt phản ánh</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn duyệt phản ánh này không?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="approvalNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú duyệt (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú cho việc duyệt phản ánh..."
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Duyệt phản ánh
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackApprovalForm
