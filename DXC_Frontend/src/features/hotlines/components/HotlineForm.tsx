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
import { useCreateHotline, useUpdateHotline, useHotlineCategories } from '../hooks/useHotlines'
import type { HotlineDto } from '@/api/models'

const hotlineFormSchema = z.object({
  categoryPublicId: z.string()
    .min(1, 'Vui lòng chọn danh mục'),
  contactName: z.string()
    .min(2, 'Tên liên hệ phải có ít nhất 2 ký tự')
    .max(200, 'Tên liên hệ không được vượt quá 200 ký tự'),
  phoneNumber: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự'),
  description: z.string().optional(),
  thuTu: z.number().int('Thứ tự phải là số nguyên').min(0, 'Thứ tự phải >= 0').optional(),
})

type HotlineFormData = z.infer<typeof hotlineFormSchema>

interface HotlineFormProps {
  initialData?: HotlineDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export interface HotlineFormHandle {
  submit: () => void
}

export const HotlineForm = forwardRef<HotlineFormHandle, HotlineFormProps>(
  ({ initialData, onSuccess, onSave }, ref) => {
    const createMutation = useCreateHotline()
    const updateMutation = useUpdateHotline()
    const { data: categoriesData } = useHotlineCategories()
    const isEditing = !!initialData?.publicId

    const form = useForm<HotlineFormData>({
      resolver: zodResolver(hotlineFormSchema),
      defaultValues: {
        categoryPublicId: initialData?.categoryPublicId || '',
        contactName: initialData?.contactName || '',
        phoneNumber: initialData?.phoneNumber || '',
        description: initialData?.description || '',
        thuTu: typeof (initialData as any)?.thuTu === 'number' ? (initialData as any).thuTu : undefined,
      },
    })

    const onSubmit = async (data: HotlineFormData) => {
      const submitData = {
        categoryPublicId: data.categoryPublicId,
        contactName: data.contactName.trim() || null,
        phoneNumber: data.phoneNumber.trim() || null,
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
          {/* Category Field */}
          <FormField
            control={form.control}
            name="categoryPublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Danh mục <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
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

          {/* Contact Name Field */}
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên liên hệ <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên liên hệ"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số điện thoại <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập số điện thoại"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                    value={field.value || ''}
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
                    placeholder="Nhập mô tả hotline"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    {...field}
                    value={field.value || ''}
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

HotlineForm.displayName = 'HotlineForm'

export default HotlineForm
