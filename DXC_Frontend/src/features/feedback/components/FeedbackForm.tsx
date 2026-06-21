import { useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X, FileIcon, Download } from 'lucide-react'
import { feedbackSchema, type FeedbackFormData } from '../schemas'
import { useFileUpload, useFileDownload } from '../hooks'
import type { FeedbackDetailDto } from '@/api/models'

interface FeedbackFormProps {
  initialData?: FeedbackDetailDto
  onSubmit: (data: FeedbackFormData) => void
  isEdit?: boolean
  onSave?: (submit: () => void) => void
}

const FeedbackForm = ({
  initialData,
  onSubmit,
  isEdit = false,
  onSave,
}: FeedbackFormProps) => {
  const { uploadedFiles, isUploading, handleUpload, removeFile, getPublicIds } = useFileUpload()
  const { downloadFile } = useFileDownload()
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      fullName: initialData?.fullName || '',
      phoneNumber: initialData?.phoneNumber || '',
      location: initialData?.location || '',
      isPublic: initialData?.isPublic || false,
      attachmentPublicIds: initialData?.attachments?.map(a => a.publicId || '').filter(Boolean) || [],
    },
  })

  const handleFormSubmit = (data: FeedbackFormData) => {
    const submitData = {
      ...data,
      attachmentPublicIds: getPublicIds().length > 0 ? getPublicIds() : null,
    }
    onSubmit(submitData)
  }

  // Expose form submission to parent via onSave callback
  useEffect(() => {
    if (onSave) {
      onSave(() => {
        formRef.current?.requestSubmit()
      })
    }
  }, [onSave])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    await handleUpload(files)
    // Reset input để có thể upload cùng file lại
    e.target.value = ''
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề phản ánh..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nội dung <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết nội dung phản ánh..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ và tên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0912345678"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Địa chỉ hoặc vị trí liên quan..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tệp đính kèm</FormLabel>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className={`flex items-center justify-center gap-2 rounded-md border border-dashed border-input p-4 hover:bg-accent cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Đang tải lên...' : 'Chọn hoặc kéo thả tệp vào đây'}
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Kích thước tối đa: 10MB mỗi tệp. Hỗ trợ: ảnh, PDF, Word
                </p>
                {isEdit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Lưu ý: Các tệp hiện tại sẽ được giữ nguyên. Bạn chỉ có thể thêm tệp mới.
                  </p>
                )}
              </div>

              {isEdit && initialData?.attachments && initialData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Tệp đính kèm hiện tại:</div>
                  {initialData.attachments.map((attachment, index) => (
                    <div
                      key={`existing-${attachment.id || index}`}
                      className="flex items-center justify-between p-2 rounded-md border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{attachment.fileName || 'Không có tên'}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
                        </span>
                        {attachment.filePublicId && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(attachment.filePublicId!, attachment.fileName || 'file')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Tệp mới được thêm:</div>
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

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Công khai phản ánh</FormLabel>
                    <FormDescription>
                      Cho phép hiển thị phản ánh này trên trang công khai
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
      </form>
    </Form>
  )
}

export default FeedbackForm
