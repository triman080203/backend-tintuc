import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments'
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations'
import type { DepartmentWithOrganizationDto } from '@/api/models'

const departmentFormSchema = z.object({
  name: z.string()
    .min(2, 'Tên phòng ban phải có ít nhất 2 ký tự')
    .max(200, 'Tên phòng ban không được vượt quá 200 ký tự'),
  code: z.string().optional(),
  description: z.string().optional(),
  contactEmail: z.string()
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')),
  contactPhone: z.string()
    .optional()
    .or(z.literal('')),
  organizationPublicId: z.string().min(1, 'Vui lòng chọn tổ chức'),
})

type DepartmentFormData = z.infer<typeof departmentFormSchema>

interface DepartmentFormProps {
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
  initialData?: DepartmentWithOrganizationDto
}

export function DepartmentForm({ onSuccess, onSave, initialData }: DepartmentFormProps) {
  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment()
  const isEditing = !!initialData?.publicId
  const { data: organizationsResponse } = useOrganizations({ PageSize: 100 })
  
  const organizations = organizationsResponse?.data || []
  
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      contactEmail: initialData?.contactEmail || '',
      contactPhone: initialData?.contactPhone || '',
      organizationPublicId: initialData?.organizationPublicId || '',
    },
  })

  const onSubmit = async (data: DepartmentFormData) => {
    const submitData = {
      organizationPublicId: data.organizationPublicId,
      code: data.code?.trim() || null,
      name: data.name.trim() || null,
      description: data.description?.trim() || null,
    }
    
    if (isEditing && initialData?.publicId) {
      updateMutation.mutate({ publicId: initialData.publicId, ...submitData }, {
        onSuccess: () => {
          onSuccess?.()
        },
      })
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          onSuccess?.()
          form.reset()
        },
      })
    }
  }

  // Expose submit function via onSave callback (submitRef pattern)
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phòng ban *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên phòng ban" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phòng ban</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã phòng ban (không bắt buộc)" {...field} />
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
                      placeholder="Nhập mô tả về phòng ban" 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Thông tin liên hệ (tùy chọn)</h3>
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email liên hệ</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Nhập email liên hệ" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại liên hệ</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="Nhập số điện thoại" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="organizationPublicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tổ chức *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tổ chức" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations?.map((org: any) => (
                          <SelectItem key={org.publicId} value={org.publicId}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

      </form>
    </Form>
  )
}
