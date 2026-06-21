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
import { Loader2, Upload, X, FileIcon } from 'lucide-react'
import { feedbackResponseSchema, type FeedbackResponseFormData } from '../schemas'
import { useFileUpload } from '../hooks'

interface FeedbackResponseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FeedbackResponseFormData) => void
  isSubmitting?: boolean
  initialData?: {
    responseContent: string | null
    filePublicIds?: string[] | null
  }
  isEdit?: boolean
}

const FeedbackResponseForm = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialData,
  isEdit = false,
}: FeedbackResponseFormProps) => {
  const { uploadedFiles, isUploading, handleUpload, removeFile, getPublicIds } = useFileUpload()

  const form = useForm<FeedbackResponseFormData>({
    resolver: zodResolver(feedbackResponseSchema),
    defaultValues: {
      responseContent: initialData?.responseContent || '',
      filePublicIds: initialData?.filePublicIds || [],
    },
  })

  const handleFormSubmit = (data: FeedbackResponseFormData) => {
    const submitData = {
      ...data,
      filePublicIds: getPublicIds().length > 0 ? getPublicIds() : null,
    }
    onSubmit(submitData)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    await handleUpload(files)
    // Reset input để có thể upload cùng file lại
    e.target.value = ''
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Chỉnh sửa phản hồi' : 'Tạo phản hồi xử lý'}
          </DialogTitle>
          <DialogDescription>
            Nhập kết quả xử lý và đính kèm các tài liệu liên quan (nếu có)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="responseContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nội dung phản hồi <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết kết quả xử lý phản ánh..."
                      className="min-h-[200px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tài liệu kèm theo</FormLabel>
              <div className="mt-2">
                <label
                  htmlFor="response-file-upload"
                  className={`flex items-center justify-center gap-2 rounded-md border border-dashed border-input p-4 hover:bg-accent cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Đang tải lên...' : 'Tải lên tài liệu kết quả xử lý'}
                  </span>
                  <input
                    id="response-file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Kích thước tối đa: 10MB mỗi tệp. Hỗ trợ: ảnh, PDF, Word, Excel
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map(file => (
                    <div
                      key={file.uid}
                      className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.uid)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Cập nhật' : 'Gửi phản hồi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackResponseForm
