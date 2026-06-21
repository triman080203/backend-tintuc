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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { assignFeedbackSchema, type AssignFeedbackFormData } from '../schemas'
import { useDepartments } from '../hooks'

interface FeedbackAssignFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedbackPublicId: string
  onSubmit: (data: AssignFeedbackFormData) => void
  isSubmitting?: boolean
}

const FeedbackAssignForm = ({
  open,
  onOpenChange,
  feedbackPublicId,
  onSubmit,
  isSubmitting = false,
}: FeedbackAssignFormProps) => {
  const { data: departments = [], isLoading: departmentsLoading } = useDepartments()
  const form = useForm<AssignFeedbackFormData>({
    resolver: zodResolver(assignFeedbackSchema),
    defaultValues: {
      feedbackPublicId,
      departmentPublicId: '',
      toStatusId: 2, // Hard-coded to "đang xử lý" status (as number)
      processingNote: '',
    },
  })

  const isLoading = departmentsLoading

  const handleFormSubmit = (data: AssignFeedbackFormData) => {
    onSubmit({
      ...data,
      feedbackPublicId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Điều phối phản ánh</DialogTitle>
          <DialogDescription>
            Chỉ định phòng ban xử lý. Trạng thái sẽ tự động được cập nhật thành "Đang xử lý".
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="departmentPublicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phòng ban xử lý <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={departments.length === 0}>
                          <SelectValue placeholder="Chọn phòng ban..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.length === 0 ? (
                          <SelectItem value="" disabled>
                            Không có phòng ban
                          </SelectItem>
                        ) : (
                          departments.map(dept => (
                            <SelectItem key={dept.publicId} value={dept.publicId}>
                              {dept.name} {dept.code ? `(${dept.code})` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

            <FormField
              control={form.control}
              name="processingNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú về việc điều phối (tùy chọn)..."
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting || departments.length === 0}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackAssignForm
