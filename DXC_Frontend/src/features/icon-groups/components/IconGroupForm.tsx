import React, { useImperativeHandle, forwardRef } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateIconGroup, useUpdateIconGroup } from '../hooks/useIconGroups'
import { IconGroupImageUploader } from './IconGroupImageUploader'
import { useIconCategories } from '@/features/icon-categories/hooks/useIconCategories'
import type { IconGroupDto } from '@/api/models'

const iconGroupFormSchema = z.object({
  iconCategoryPublicId: z.string()
    .min(1, 'Vui lòng chọn danh mục icon'),
  name: z.string()
    .min(2, 'Tên nhóm phải có ít nhất 2 ký tự')
    .max(100, 'Tên nhóm không được vượt quá 100 ký tự'),
  description: z.string().nullable().optional(),
  displayOrder: z.number().int().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  imagePublicId: z.string().nullable().optional(),
})

type IconGroupFormData = z.infer<typeof iconGroupFormSchema>

interface IconGroupFormProps {
  initialData?: IconGroupDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface IconGroupFormHandle {
  submit: () => void
}

export const IconGroupForm = forwardRef<IconGroupFormHandle, IconGroupFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateIconGroup()
    const updateMutation = useUpdateIconGroup()
    const { data: categoriesData } = useIconCategories({ Current: 1, PageSize: 1000 })
    const isEditing = !!initialData?.publicId

    const form = useForm<IconGroupFormData>({
      resolver: zodResolver(iconGroupFormSchema),
      defaultValues: {
        iconCategoryPublicId: initialData?.iconCategoryPublicId || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        displayOrder: initialData?.displayOrder ?? 0,
        isActive: initialData?.isActive ?? true,
        imagePublicId: initialData?.imagePublicId || null,
      },
    })

    const onSubmit = async (data: IconGroupFormData) => {
      const submitData = {
        iconCategoryPublicId: data.iconCategoryPublicId,
        name: data.name.trim() || null,
        description: data.description?.trim() || null,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
        imagePublicId: data.imagePublicId || null,
      }

      if (isEditing && initialData?.publicId) {
        updateMutation.mutate(
          { publicId: initialData.publicId, ...submitData },
          {
            onSuccess: () => {
              onSuccess?.()
            },
          }
        )
      } else {
        createMutation.mutate(submitData, {
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
          {/* Icon Category Field */}
          <FormField
            control={form.control}
            name="iconCategoryPublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Danh mục icon <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending || isEditing}
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

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên nhóm <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên nhóm icon"
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
                    placeholder="Nhập mô tả nhóm icon"
                    disabled={createMutation.isPending || updateMutation.isPending}
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
            name="imagePublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh nhóm</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <IconGroupImageUploader
                      onImageUploaded={(publicId) => field.onChange(publicId)}
                      onUploadingChange={() => {}}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      existingImagePublicId={initialData?.imagePublicId || null}
                    />
                    <input type="hidden" value={field.value ?? ''} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display Order Field */}
          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự hiển thị</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Nhập thứ tự hiển thị"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Status Field */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Kích hoạt nhóm</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
)

IconGroupForm.displayName = 'IconGroupForm'
