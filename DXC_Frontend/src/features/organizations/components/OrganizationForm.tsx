import { useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useCreateOrganization, useUpdateOrganization } from '../hooks/useOrganizations'
import type { OrganizationWithDepartmentsDto } from '@/api/models'

const organizationFormSchema = z.object({
  name: z.string()
    .min(2, 'Tên tổ chức phải có ít nhất 2 ký tự')
    .max(200, 'Tên tổ chức không được vượt quá 200 ký tự'),
  code: z.string().optional(),
  description: z.string().optional(),
})

type OrganizationFormData = z.infer<typeof organizationFormSchema>

interface OrganizationFormProps {
  initialData?: OrganizationWithDepartmentsDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
  formRef?: React.Ref<HTMLFormElement>
}

export function OrganizationForm({ initialData, onSuccess, onSave, formRef: externalFormRef }: OrganizationFormProps) {
  const createMutation = useCreateOrganization()
  const updateMutation = useUpdateOrganization()
  const isEditing = !!initialData?.publicId
  const internalFormRef = useRef<HTMLFormElement>(null)
  const formRef = externalFormRef || internalFormRef
  
  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    },
  })

  const onSubmit = (data: OrganizationFormData) => {
    const submitData = {
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

  // Expose form submission to parent
  useEffect(() => {
    if (onSave) {
      onSave(() => {
        if (formRef && 'current' in formRef) {
          formRef.current?.requestSubmit()
        }
      })
    }
  }, [onSave, formRef])

  return (
    <Form {...form}>
      <form 
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tổ chức *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tổ chức" {...field} />
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
                  <FormLabel>Mã tổ chức</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã tổ chức (không bắt buộc)" {...field} />
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
                      placeholder="Nhập mô tả về tổ chức" 
                      className="resize-none"
                      rows={3}
                      {...field} 
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
