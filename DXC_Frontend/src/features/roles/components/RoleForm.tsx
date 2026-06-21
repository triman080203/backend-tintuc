import React from 'react'
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
import { useCreateRole, useUpdateRole } from '../hooks/useRoles'
import type { RoleDto } from '@/api/models'

// ====== VALIDATION SCHEMA ======
const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được vượt quá 100 ký tự'),
  code: z
    .string()
    .min(2, 'Mã phải có ít nhất 2 ký tự')
    .max(50, 'Mã không được vượt quá 50 ký tự'),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional(),
})

type FormData = z.infer<typeof formSchema>

interface RoleFormProps {
  initialData?: RoleDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const RoleForm = ({
  initialData,
  onSuccess,
  onSave,
}: RoleFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()

  // ====== FORM SETUP ======
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    },
  })

  // ====== FORM SUBMISSION ======
  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        // Update existing
        await updateMutation.mutateAsync(
          { 
            publicId: initialData!.publicId!,
            name: data.name,
            code: data.code,
            description: data.description,
          }
        )
      } else {
        // Create new
        await createMutation.mutateAsync({
          name: data.name,
          code: data.code,
          description: data.description,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // ====== EXPOSE SUBMIT FUNCTION ======
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ===== NAME FIELD ===== */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên vai trò..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== CODE FIELD ===== */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mã <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập mã vai trò..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== DESCRIPTION FIELD ===== */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả vai trò..."
                  rows={4}
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
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

export default RoleForm
