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
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateTicket, useUpdateTicket } from '../hooks/useTickets'
import type { TicketDto } from '@/api/models'

const formSchema = z.object({
  name: z.string().min(1, 'Tên vé không được để trống'),
  description: z.string().optional().or(z.literal('')),
  price: z.number().min(0, 'Giá phải >= 0'),
  childPrice: z.number().min(0, 'Giá phải >= 0').optional(),
  priceCurrency: z.string().optional().or(z.literal('')),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
  isActive: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

interface TicketFormProps {
  initialData?: TicketDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const TicketForm = ({ initialData, onSuccess, onSave }: TicketFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateTicket()
  const updateMutation = useUpdateTicket()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      childPrice: initialData?.childPrice || 0,
      priceCurrency: initialData?.priceCurrency || 'VND',
      thuTu: initialData?.thuTu || 0,
      isActive: initialData?.isActive ?? true,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const finalData = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        childPrice: data.childPrice || 0,
        priceCurrency: data.priceCurrency || null,
        thuTu: typeof data.thuTu === 'number' ? data.thuTu : 0,
        isActive: data.isActive ?? true
      }

      if (isEditing) {
        await updateMutation.mutateAsync({
          publicId: initialData.publicId!,
          ...finalData
        }, { onSuccess: () => onSuccess?.() })
      } else {
        await createMutation.mutateAsync(finalData, { onSuccess: () => onSuccess?.() })
      }
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên loại vé *</FormLabel><FormControl><Input placeholder="VD: Cáp treo khứ hồi..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Giá Người lớn</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="childPrice" render={({ field }) => (
            <FormItem><FormLabel>Giá Trẻ em</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="priceCurrency" render={({ field }) => (
            <FormItem><FormLabel>Đơn vị tiền tệ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="thuTu" render={({ field }) => (
            <FormItem><FormLabel>Thứ tự hiển thị</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Mô tả chi tiết</FormLabel><FormControl><Textarea rows={5} placeholder="Đi + Vé bằng cáp treo..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="m-0">Kích hoạt</FormLabel></FormItem>
        )} />
      </form>
    </Form>
  )
}
