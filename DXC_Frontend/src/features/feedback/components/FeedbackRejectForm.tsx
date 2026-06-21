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
import { Loader2, XCircle } from 'lucide-react'
import { rejectFeedbackSchema, type RejectFeedbackFormData } from '../schemas'

interface FeedbackRejectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedbackPublicId: string
  onSubmit: (data: RejectFeedbackFormData) => void
  isSubmitting?: boolean
}

const FeedbackRejectForm = ({
  open,
  onOpenChange,
  feedbackPublicId,
  onSubmit,
  isSubmitting = false,
}: FeedbackRejectFormProps) => {
  const form = useForm<RejectFeedbackFormData>({
    resolver: zodResolver(rejectFeedbackSchema),
    defaultValues: {
      feedbackPublicId,
      toStatusId: '5', // Hard-coded to "từ chối" status
      rejectionReason: '',
    },
  })

  const handleFormSubmit = (data: RejectFeedbackFormData) => {
    onSubmit({
      ...data,
      feedbackPublicId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Từ chối phản ánh
          </DialogTitle>
          <DialogDescription>
            Nhập lý do từ chối phản ánh này. Trạng thái sẽ được cập nhật thành "Từ chối".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lý do từ chối <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Vui lòng nhập lý do từ chối phản ánh..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ''}
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
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Từ chối
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackRejectForm
