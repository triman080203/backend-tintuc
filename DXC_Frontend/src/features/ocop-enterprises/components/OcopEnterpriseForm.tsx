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
import { useCreateOcopEnterprise, useUpdateOcopEnterprise } from '../hooks/useOcopEnterprises'
import type { OcopEnterpriseDto } from '@/api/models'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(200, 'Tên không được vượt quá 200 ký tự'),
  phoneNumber: z
    .string()
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự')
    .optional()
    .or(z.literal('')),
  representative: z
    .string()
    .max(100, 'Người đại diện không được vượt quá 100 ký tự')
    .optional()
    .or(z.literal('')),
  taxCode: z
    .string()
    .max(20, 'Mã số thuế không được vượt quá 20 ký tự')
    .optional()
    .or(z.literal('')),
  establishedYear: z
    .number()
    .int()
    .min(1900, 'Năm thành lập từ 1900')
    .max(new Date().getFullYear(), 'Năm không hợp lệ')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
  ocopCertificateNumber: z
    .string()
    .max(50, 'Số chứng chỉ không được vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  latitude: z
    .number()
    .min(-90, 'Vĩ độ phải >= -90')
    .max(90, 'Vĩ độ phải <= 90')
    .optional()
    .or(z.literal('')),
  longitude: z
    .number()
    .min(-180, 'Kinh độ phải >= -180')
    .max(180, 'Kinh độ phải <= 180')
    .optional()
    .or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

interface OcopEnterpriseFormProps {
  initialData?: OcopEnterpriseDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const OcopEnterpriseForm = ({
  initialData,
  onSuccess,
  onSave,
}: OcopEnterpriseFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateOcopEnterprise()
  const updateMutation = useUpdateOcopEnterprise()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      phoneNumber: initialData?.phoneNumber || '',
      representative: initialData?.representative || '',
      taxCode: initialData?.taxCode || '',
      establishedYear: initialData?.establishedYear || undefined,
      address: initialData?.address || '',
      ocopCertificateNumber: initialData?.ocopCertificateNumber || '',
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          publicId: initialData!.publicId!,
          name: data.name,
          phoneNumber: data.phoneNumber,
          representative: data.representative,
          taxCode: data.taxCode,
          establishedYear: data.establishedYear as number | undefined,
          address: data.address,
          ocopCertificateNumber: data.ocopCertificateNumber,
          latitude: data.latitude as number | undefined,
          longitude: data.longitude as number | undefined,
          isActive: initialData?.isActive,
        })
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          phoneNumber: data.phoneNumber,
          representative: data.representative,
          taxCode: data.taxCode,
          establishedYear: data.establishedYear as number | undefined,
          address: data.address,
          ocopCertificateNumber: data.ocopCertificateNumber,
          latitude: data.latitude as number | undefined,
          longitude: data.longitude as number | undefined,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên doanh nghiệp <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên doanh nghiệp..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số điện thoại..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="representative"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người đại diện</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên người đại diện..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã số thuế</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập mã số thuế..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="establishedYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Năm thành lập</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập năm thành lập..."
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : '')}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập địa chỉ..."
                  rows={3}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ocopCertificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số chứng chỉ OCOP</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập số chứng chỉ..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vĩ độ</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Nhập vĩ độ..."
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kinh độ</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Nhập kinh độ..."
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                    disabled={isSubmitting}
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

export default OcopEnterpriseForm
