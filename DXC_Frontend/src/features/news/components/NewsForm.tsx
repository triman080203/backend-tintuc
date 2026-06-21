import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateNews, useUpdateNews } from '../hooks/useNews'
import { NewsImageUploader } from './NewsImageUploader'
import type { ArticleDto } from '@/api/models' // assuming DTO is ArticleDto

// ====== VALIDATION SCHEMA ======
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
  slug: z.string().max(255, 'Slug không được vượt quá 255 ký tự').optional().or(z.literal('')),
  summary: z.string().max(1000, 'Tóm tắt không được vượt quá 1000 ký tự').optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  coverImagePublicId: z.string().optional().or(z.literal('')),
  authorName: z.string().max(100, 'Tên tác giả không được vượt quá 100 ký tự').optional().or(z.literal('')),
  publishedAt: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
})

type FormData = z.infer<typeof formSchema>

interface NewsFormProps {
  initialData?: ArticleDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const NewsForm = ({
  initialData,
  onSuccess,
  onSave,
}: NewsFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateNews()
  const updateMutation = useUpdateNews()
  const [isImageUploading, setIsImageUploading] = useState(false)

  // ====== FORM SETUP ======
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      coverImagePublicId: initialData?.coverImagePublicId || '',
      authorName: initialData?.authorName || '',
      publishedAt: initialData?.publishedAt || '',
      isActive: initialData?.isActive ?? true,
      thuTu: initialData?.thuTu ?? undefined,
    },
  })

  // ====== IMAGE UPLOAD CALLBACKS ======
  const handleImageUploaded = useCallback((publicId: string | null) => {
    form.setValue('coverImagePublicId', publicId || '')
  }, [form])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  // ====== FORM SUBMISSION ======
  const onSubmit = async (data: FormData) => {
    // Prevent submit during upload
    if (isImageUploading) {
      return
    }

    try {
      const finalData = {
        title: data.title || null,
        slug: data.slug || null,
        summary: data.summary || null,
        content: data.content || null,
        coverImagePublicId: data.coverImagePublicId || null,
        authorName: data.authorName || null,
        publishedAt: data.publishedAt || null,
        thuTu: typeof data.thuTu === 'number' ? data.thuTu : 0,
        isActive: data.isActive,
      }

      if (isEditing) {
        // Update existing
        const updateData = {
          publicId: initialData.publicId!,
          ...finalData,
        }
        await updateMutation.mutateAsync(updateData, {
          onSuccess: () => onSuccess?.()
        })
      } else {
        // Create new
        await createMutation.mutateAsync(finalData, {
          onSuccess: () => onSuccess?.(),
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // ====== EXPOSE SUBMIT FUNCTION ======
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ===== TITLE FIELD ===== */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tiêu đề <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tiêu đề tin tức..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== SLUG FIELD ===== */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="nhap-tieu-de-tin-tuc (Để trống sẽ tự tạo)"
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== SUMMARY FIELD ===== */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tóm tắt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập tóm tắt..."
                  rows={3}
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== CONTENT FIELD ===== */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung chi tiết</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung chi tiết..."
                  rows={10}
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ===== AUTHOR NAME FIELD ===== */}
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tác giả</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên tác giả..."
                    {...field}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===== PUBLISHED AT FIELD ===== */}
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày xuất bản (ISO 8601 string)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2024-12-31T23:59:59"
                    {...field}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===== ORDER FIELD ===== */}
          <FormField
            control={form.control}
            name="thuTu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự hiển thị</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="VD: 0, 1, 2..."
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value !== '' ? parseInt(e.target.value, 10) : undefined)}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ===== ACTIVE STATUS FIELD ===== */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Trạng thái hiển thị</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Tin tức có đang hiển thị cho người dùng không
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* ===== IMAGE UPLOAD SECTION ===== */}
        <div className="space-y-2">
          <FormLabel>Ảnh bìa</FormLabel>
          <NewsImageUploader
            onImageUploaded={handleImageUploaded}
            disabled={createMutation.isPending || updateMutation.isPending}
            onUploadingChange={handleUploadingChange}
            existingImageUrl={initialData?.coverImageUrl}
            existingImagePublicId={initialData?.coverImagePublicId}
          />
        </div>
      </form>
    </Form>
  )
}

export default NewsForm
