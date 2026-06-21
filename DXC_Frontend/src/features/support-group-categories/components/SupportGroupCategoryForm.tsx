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
import { useCreateSupportGroupCategory, useUpdateSupportGroupCategory } from '../hooks/useSupportGroupCategories'
import type { SupportGroupCategoryDto } from '@/api/models'

const supportGroupCategoryFormSchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(200, 'Tên danh mục không được vượt quá 200 ký tự'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

type SupportGroupCategoryFormData = z.infer<typeof supportGroupCategoryFormSchema>

interface SupportGroupCategoryFormProps {
  initialData?: SupportGroupCategoryDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface SupportGroupCategoryFormHandle {
  submit: () => void
}

export const SupportGroupCategoryForm = forwardRef<SupportGroupCategoryFormHandle, SupportGroupCategoryFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateSupportGroupCategory()
    const updateMutation = useUpdateSupportGroupCategory()
    const isEditing = !!initialData?.publicId

    const form = useForm<SupportGroupCategoryFormData>({
      resolver: zodResolver(supportGroupCategoryFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        isActive: initialData?.isActive ?? true,
      },
    })

    const onSubmit = async (data: SupportGroupCategoryFormData) => {
      const submitData = {
        name: data.name.trim() || null,
        description: data.description?.trim() || null,
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
                    placeholder="Nhập tên danh mục"
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
                    placeholder="Nhập mô tả danh mục"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* IsActive Field */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Trạng thái hoạt động
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Cho phép danh mục này hoạt động trong hệ thống
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
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

SupportGroupCategoryForm.displayName = 'SupportGroupCategoryForm'