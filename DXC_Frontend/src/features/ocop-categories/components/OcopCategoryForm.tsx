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
import { useCreateOcopCategory, useUpdateOcopCategory } from '../hooks/useOcopCategories'
import { OcopCategoryImageUploader } from './OcopCategoryImageUploader'
import type { OcopProductCategoryDto } from '@/api/models'

const formSchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  description: z.string().max(500, 'Mô tả không được vượt quá 500 ký tự').optional(),
  displayOrder: z.number().int('Thứ tự phải là số nguyên').min(0, 'Thứ tự không được âm').optional(),
  imagePublicId: z.string().optional().or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

interface OcopCategoryFormProps {
  initialData?: OcopProductCategoryDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const OcopCategoryForm = ({
  initialData,
  onSuccess,
  onSave,
}: OcopCategoryFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateOcopCategory()
  const updateMutation = useUpdateOcopCategory()
  const [isImageUploading, setIsImageUploading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      displayOrder: initialData?.displayOrder || 0,
      imagePublicId: '',
    },
  })

  const handleImageUploaded = useCallback((publicId: string | null) => {
    form.setValue('imagePublicId', publicId || '')
  }, [form])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  const onSubmit = React.useCallback(async (data: FormData) => {
    const initialPublicId = initialData?.publicId
    const initialIsActive = initialData?.isActive
    if (isImageUploading) {
      return
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(
          {
            publicId: initialPublicId!,
            name: data.name,
            description: data.description,
            displayOrder: data.displayOrder,
            imagePublicId: data.imagePublicId === '00000000-0000-0000-0000-000000000000'
              ? '00000000-0000-0000-0000-000000000000'
              : (data.imagePublicId || null),
            isActive: initialIsActive,
          }
        )
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          displayOrder: data.displayOrder,
          imagePublicId: data.imagePublicId || null,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }, [isImageUploading, isEditing, initialData?.publicId, initialData?.isActive, updateMutation, createMutation, onSuccess])

  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave, onSubmit])

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên danh mục <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên danh mục..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả danh mục..."
                  rows={4}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự hiển thị</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập thứ tự hiển thị..."
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagePublicId"
          render={() => (
            <FormItem>
              <FormLabel>Ảnh danh mục</FormLabel>
              <FormControl>
                <OcopCategoryImageUploader
                  onImageUploaded={handleImageUploaded}
                  onUploadingChange={handleUploadingChange}
                  disabled={isSubmitting}
                  existingImage={initialData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default OcopCategoryForm
