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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useCreateIconCategory, useUpdateIconCategory } from '../hooks/useIconCategories'
import type { IconCategoryDto } from '@/api/models'

const iconCategoryFormSchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
  description: z.string().nullable().optional(),
  displayOrder: z.number().int().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
})

type IconCategoryFormData = z.infer<typeof iconCategoryFormSchema>

interface IconCategoryFormProps {
  initialData?: IconCategoryDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface IconCategoryFormHandle {
  submit: () => void
}

export const IconCategoryForm = forwardRef<IconCategoryFormHandle, IconCategoryFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateIconCategory()
    const updateMutation = useUpdateIconCategory()
    const isEditing = !!initialData?.publicId

    const form = useForm<IconCategoryFormData>({
      resolver: zodResolver(iconCategoryFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        displayOrder: initialData?.displayOrder ?? 0,
        isActive: initialData?.isActive ?? true,
      },
    })

    const onSubmit = async (data: IconCategoryFormData) => {
      const submitData = {
        name: data.name.trim() || null,
        description: data.description?.trim() || null,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
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
          {/* Name Field */}
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
                    placeholder="Nhập tên danh mục icon"
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
                    placeholder="Nhập mô tả danh mục icon"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                    value={field.value || ''}
                  />
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
                  <FormLabel className="text-base">Kích hoạt danh mục</FormLabel>
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

IconCategoryForm.displayName = 'IconCategoryForm'
