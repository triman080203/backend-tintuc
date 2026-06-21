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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { tinTucSchema, type TinTucFormData } from '../schemas'
import { useTinTucCategoryList } from '../categories/hooks'
import type { TinTucArticleDetailDto } from '@/api/models'

interface TinTucFormProps {
  initialData?: TinTucArticleDetailDto
  onSubmit: (data: TinTucFormData) => void
  isEdit?: boolean
  onSave?: (submit: () => void) => void
}

export const TinTucForm = ({
  initialData,
  onSubmit,
  onSave,
}: TinTucFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)

  const { data: categoriesRes } = useTinTucCategoryList({ isActive: true, pageSize: 100 })
  const categories = categoriesRes?.data || []

  const form = useForm<TinTucFormData>({
    resolver: zodResolver(tinTucSchema),
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      categoryId: initialData?.categoryId || 1, // Default CategoryId
      tags: initialData?.tags || '',
      authorName: initialData?.authorName || '',
      attachmentPublicIds: initialData?.attachments?.map(a => a.publicId || '').filter(Boolean) || [],
    },
  })

  const handleFormSubmit = (data: TinTucFormData) => {
    onSubmit(data)
  }

  // Expose form submission to parent via onSave callback
  useEffect(() => {
    if (onSave) {
      onSave(() => {
        formRef.current?.requestSubmit()
      })
    }
  }, [onSave])

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
                <Input placeholder="Nhập tiêu đề tin bài..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tóm tắt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả tóm tắt nội dung..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value || ''}
                />
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
                  placeholder="Nội dung chi tiết tin bài..."
                  className="min-h-[300px]"
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
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tác giả</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tác giả..." {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục tin tức <span className="text-destructive">*</span></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id?.toString() || ''}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
