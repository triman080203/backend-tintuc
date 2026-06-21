import React, { useImperativeHandle, forwardRef, useState, useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateIcon, useUpdateIcon } from '../hooks/useIcons'
import { useIconGroups } from '@/features/icon-groups/hooks/useIconGroups'
import { useIconCategories } from '@/features/icon-categories/hooks/useIconCategories'
import { IconImageUploader } from './IconImageUploader'
import type { IconDto } from '@/api/models'

const iconTypes = ['native','web'] as const

const iconFormSchema = z.object({
  name: z.string().min(1, 'Tên icon không được để trống').max(100, 'Tên icon không được vượt quá 100 ký tự'),
  description: z.string().max(500, 'Mô tả không vượt quá 500 ký tự').optional(),
  iconGroupPublicId: z.string().optional(),
  iconCategoryPublicId: z.string().min(1, 'Bắt buộc chọn danh mục'),
  iconImageUrl: z.string().optional(),
  iconType: z.enum(iconTypes),
  screenParams: z.string().optional(),
  webLink: z.string().optional(),
  linkAndroid: z.string().optional(),
  linkIOS: z.string().optional(),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị phải >= 0').optional(),
}).superRefine((data, ctx) => {
  if (data.iconType === 'web' && data.webLink) {
    try {
      const u = new URL(data.webLink)
      if (!u.protocol || !u.host) throw new Error('invalid')
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['webLink'], message: 'WebLink phải là URL hợp lệ' })
    }
  }
  if (data.iconType === 'native') {
    if (!data.screenParams) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['screenParams'], message: 'ScreenParams bắt buộc khi loại native' })
    }
  }
})

type IconFormData = z.infer<typeof iconFormSchema>

interface IconFormProps {
  initialData?: IconDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface IconFormHandle {
  submit: () => void
}

export const IconForm = forwardRef<IconFormHandle, IconFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateIcon()
    const updateMutation = useUpdateIcon()
    const { data: groupsData } = useIconGroups({ Current: 1, PageSize: 1000 })
    const { data: categoriesData } = useIconCategories({ Current: 1, PageSize: 1000 })
    const isEditing = !!initialData?.publicId
    const [isImageUploading, setIsImageUploading] = useState(false)

    const form = useForm<IconFormData>({
      resolver: zodResolver(iconFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        iconGroupPublicId: initialData?.iconGroupPublicId || '',
        iconCategoryPublicId: initialData?.iconCategoryPublicId || '',
        iconImageUrl: initialData?.iconImageUrl || '',
        iconType: (['native','web'].includes(String(initialData?.iconType))
          ? (initialData?.iconType as 'native'|'web')
          : 'web'),
        screenParams: initialData?.screenParams || '',
        webLink: initialData?.webLink || '',
        linkAndroid: (initialData as any)?.linkAndroid || '',
        linkIOS: (initialData as any)?.linkIOS || '',
        displayOrder: initialData?.displayOrder ?? 0,
      },
    })

    const handleImagesUploaded = useCallback((publicIds: string[]) => {
      const id = publicIds[0]
      if (!id) {
        form.setValue('iconImageUrl', '')
        return
      }
      const isUrl = typeof id === 'string' && id.includes('/api/files/')
      const url = isUrl ? id : `/api/files/${id}`
      form.setValue('iconImageUrl', url)
    }, [form])

    const handleUploadingChange = useCallback((uploading: boolean) => {
      setIsImageUploading(uploading)
    }, [])

    const onSubmit: SubmitHandler<IconFormData> = async (data) => {
      if (isImageUploading) {
        return
      }

      const clean = (s?: string) => (s ? s.trim().replace(/^`+|`+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '') : null)
      const submitData = {
        name: data.name.trim() || null,
        description: clean(data.description || undefined),
        iconGroupPublicId: data.iconGroupPublicId || null,
        iconCategoryPublicId: data.iconCategoryPublicId || null,
        iconImageUrl: data.iconImageUrl === '' ? '' : clean(data.iconImageUrl || undefined),
        iconType: data.iconType?.trim() || null,
        screenParams: clean(data.screenParams || undefined),
        webLink: clean(data.webLink || undefined),
        linkAndroid: clean(data.linkAndroid || undefined),
        linkIOS: clean(data.linkIOS || undefined),
        displayOrder: data.displayOrder || 0,
      }

      if (isEditing && initialData?.publicId) {
        updateMutation.mutate(
          ({ publicId: initialData.publicId, ...submitData } as any),
          {
            onSuccess: () => {
              onSuccess?.()
            },
          }
        )
      } else {
        createMutation.mutate((submitData as any), {
          onSuccess: () => {
            onSuccess?.()
          },
        })
      }
    }

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit)()
      },
    }))

    React.useEffect(() => {
      onSave?.(() => {
        form.handleSubmit(onSubmit)()
      })
    }, [form, onSubmit, onSave])

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên icon <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên icon"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả icon"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon Category Field */}
          <FormField
            control={form.control}
            name="iconCategoryPublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục icon</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData?.data?.map((category) => (
                      <SelectItem key={category.publicId} value={category.publicId || ''}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon Group Field (hiển thị khi danh mục có nhóm) */}
          {(() => {
            const selectedCat = form.watch('iconCategoryPublicId')
            const groupsForCat = (groupsData?.data || []).filter(g => g.iconCategoryPublicId === selectedCat)
            if (!selectedCat || groupsForCat.length === 0) return null
            return (
              <FormField
                control={form.control}
                name="iconGroupPublicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm icon (không bắt buộc)</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupsForCat.map((group) => (
                          <SelectItem key={group.publicId} value={group.publicId || ''}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })()}

          {/* Reset group if category changes */}
          {(() => {
            const cat = form.watch('iconCategoryPublicId')
            const group = form.watch('iconGroupPublicId')
            if (group && (groupsData?.data || []).every(g => g.publicId !== group || g.iconCategoryPublicId !== cat)) {
              form.setValue('iconGroupPublicId', '')
            }
            return null
          })()}

          {/* Image Upload */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Ảnh Icon</h3>
            <FormField
              control={form.control}
              name="iconImageUrl"
              render={() => (
                <FormItem>
                  <FormControl>
                    <IconImageUploader
                      onImagesUploaded={handleImagesUploaded}
                      onUploadingChange={handleUploadingChange}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      existingImage={initialData?.iconImageUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Advanced Settings */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-900">Cài đặt nâng cao</h3>

            {/* Icon Type */}
            <FormField
              control={form.control}
              name="iconType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại Icon</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại icon" />
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

            {/* Screen Params */}
            <FormField
              control={form.control}
              name="screenParams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tham số Màn hình</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tham số màn hình"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Web Link */}
            <FormField
              control={form.control}
              name="webLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên kết Web</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Android Link */}
            <FormField
              control={form.control}
              name="linkAndroid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên kết Android</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://play.google.com/..."
                      disabled={createMutation.isPending || updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* iOS Link */}
            <FormField
              control={form.control}
              name="linkIOS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liên kết iOS</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://apps.apple.com/..."
                      disabled={createMutation.isPending || updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Order */}
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự Hiển thị</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập thứ tự hiển thị"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    )
  }
)

IconForm.displayName = 'IconForm'
