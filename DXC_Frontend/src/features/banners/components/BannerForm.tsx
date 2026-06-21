import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateBanner, useUpdateBanner } from '../hooks/useBanners'
import { BannerImageUploader } from './BannerImageUploader'
import type { BannerDto } from '@/api/models'

const positions = ['top','middle','bottom'] as const
const bannerTypes = ['native','web'] as const

const bannerFormSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  position: z.enum(positions),
  bannerType: z.enum(bannerTypes),
  imagePublicId: z.string().min(1, 'Ảnh Banner là bắt buộc'),
  nativeParams: z.string().max(500, 'Tham số Native không vượt quá 500 ký tự').optional(),
  webLink: z.string().max(500, 'Đường dẫn Web không vượt quá 500 ký tự').optional(),
  thuTu: z.number().int('Thứ tự phải là số nguyên').min(1, 'Thứ tự phải >= 1').optional(),
}).superRefine((data, ctx) => {
  if (data.bannerType === 'native') {
    if (data.webLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['webLink'],
        message: 'WebLink chỉ dùng cho banner loại web',
      })
    }
  }
  if (data.bannerType === 'web') {
    if (data.nativeParams) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nativeParams'],
        message: 'NativeParams chỉ dùng cho banner loại native',
      })
    }
    if (data.webLink) {
      try {
        const url = new URL(data.webLink)
        if (!url.protocol || !url.host) {
          throw new Error('invalid')
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['webLink'],
          message: 'URL không hợp lệ (phải là URL tuyệt đối)',
        })
      }
    }
  }
})

type BannerFormData = z.infer<typeof bannerFormSchema>

interface BannerFormProps {
  initialData?: BannerDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSuccess, onSave }) => {
  const createMutation = useCreateBanner()
  const updateMutation = useUpdateBanner()
  const isEditing = !!initialData?.publicId
  const [isImageUploading, setIsImageUploading] = useState(false)

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      position: (['top','middle','bottom'].includes(String(initialData?.position))
        ? (initialData?.position as 'top'|'middle'|'bottom')
        : 'top'),
      bannerType: (['native','web'].includes(String(initialData?.bannerType))
        ? (initialData?.bannerType as 'native'|'web')
        : 'web'),
      imagePublicId: initialData?.imagePublicId || '',
      nativeParams: initialData?.nativeParams || '',
      webLink: initialData?.webLink || '',
      thuTu: typeof initialData?.thuTu === 'number' ? initialData?.thuTu + 1 : undefined,
    },
  })

  const onSubmit = useCallback((data: BannerFormData) => {
    if (isImageUploading) {
      return
    }

    const submitData = {
      title: data.title.trim() || null,
      position: data.position.trim() || null,
      bannerType: data.bannerType.trim() || null,
      imagePublicId: data.imagePublicId.trim(),
      nativeParams: data.nativeParams?.trim() || null,
      webLink: data.webLink?.trim() || null,
      thuTu: typeof data.thuTu === 'number' ? Math.max(0, data.thuTu - 1) : null,
    }
    
    if (isEditing && initialData?.publicId) {
      updateMutation
        .mutateAsync({ publicId: initialData.publicId, ...submitData })
        .then(() => {
          onSuccess?.()
        })
    } else {
      createMutation
        .mutateAsync(submitData)
        .then(() => {
          onSuccess?.()
          form.reset()
        })
    }
  }, [isImageUploading, isEditing, initialData?.publicId, updateMutation, createMutation, onSuccess, form])

  const handleImageUploaded = useCallback((publicId: string | null) => {
    form.setValue('imagePublicId', publicId || '')
  }, [form])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  const isPending = isEditing ? updateMutation.isPending : createMutation.isPending

  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSubmit, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thông tin cơ bản</h3>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề banner" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vị trí *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="top">Trên cùng</SelectItem>
                    <SelectItem value="middle">Giữa</SelectItem>
                    <SelectItem value="bottom">Dưới cùng</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại banner *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại banner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagePublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh Banner *</FormLabel>
                <FormControl>
                  <BannerImageUploader
                    onImageUploaded={handleImageUploaded}
                    onUploadingChange={handleUploadingChange}
                    disabled={isPending || isImageUploading}
                    existingImagePublicId={initialData?.imagePublicId}
                  />
                </FormControl>
                <input
                  {...field}
                  type="hidden"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Advanced Options */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900">Tùy chọn nâng cao</h3>

          <FormField
            control={form.control}
            name="thuTu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự hiển thị (tùy chọn)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '') {
                        field.onChange(undefined)
                        return
                      }
                      const num = Number(val)
                      field.onChange(Number.isFinite(num) ? num : undefined)
                    }}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('bannerType') === 'native' && (
            <FormField
              control={form.control}
              name="nativeParams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tham số Native (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập tham số native (JSON)"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch('bannerType') === 'web' && (
            <FormField
              control={form.control}
              name="webLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn Web (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Status: không chỉnh sửa qua form tạo/cập nhật theo API */}
      </form>
    </Form>
  )
}
