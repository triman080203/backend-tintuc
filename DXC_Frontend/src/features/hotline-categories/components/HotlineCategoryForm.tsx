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
import { useCreateHotlineCategory, useUpdateHotlineCategory } from '../hooks/useHotlineCategories'
import type { HotlineCategoryDto } from '@/api/models'

const hotlineCategoryFormSchema = z.object({
  name: z.string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(200, 'Tên danh mục không được vượt quá 200 ký tự'),
  description: z.string().optional(),
  thuTu: z.number().int('Thứ tự phải là số nguyên').min(0, 'Thứ tự phải >= 0').optional(),
})

type HotlineCategoryFormData = z.infer<typeof hotlineCategoryFormSchema>

interface HotlineCategoryFormProps {
  initialData?: HotlineCategoryDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface HotlineCategoryFormHandle {
  submit: () => void
}

export const HotlineCategoryForm = forwardRef<HotlineCategoryFormHandle, HotlineCategoryFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateHotlineCategory()
    const updateMutation = useUpdateHotlineCategory()
    const isEditing = !!initialData?.publicId

    const form = useForm<HotlineCategoryFormData>({
      resolver: zodResolver(hotlineCategoryFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        thuTu: typeof (initialData as any)?.thuTu === 'number' ? (initialData as any).thuTu : undefined,
      },
    })

    const onSubmit = async (data: HotlineCategoryFormData) => {
      const submitData = {
        name: data.name.trim() || null,
        description: data.description?.trim() || null,
        thuTu: typeof data.thuTu === 'number' ? data.thuTu : null,
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
        createMutation.mutate(submitData as any, {
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

          {/* Order Field */}
          <FormField
            control={form.control}
            name="thuTu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    placeholder="Nhập thứ tự hiển thị"
                    disabled={createMutation.isPending || updateMutation.isPending}
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
)

HotlineCategoryForm.displayName = 'HotlineCategoryForm'
