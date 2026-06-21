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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateOrder } from '../hooks/useOrders'
import type { BookingOrderDto } from '@/api/models'

const formSchema = z.object({
  status: z.string().min(1, 'Trạng thái không được để trống'),
  paymentStatus: z.string().min(1, 'Trạng thái thanh toán không được để trống'),
})

type FormData = z.infer<typeof formSchema>

interface OrderUpdateFormProps {
  initialData: BookingOrderDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const OrderUpdateForm = ({ initialData, onSuccess, onSave }: OrderUpdateFormProps) => {
  const updateMutation = useUpdateOrder()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData.status || 'Pending',
      paymentStatus: initialData.paymentStatus || 'Unpaid',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({
        publicId: initialData.publicId!,
        status: data.status,
        paymentStatus: data.paymentStatus
      }, { onSuccess: () => onSuccess?.() })
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái đơn hàng</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Chờ xác nhận (Pending)</SelectItem>
                  <SelectItem value="Confirmed">Đã xác nhận (Confirmed)</SelectItem>
                  <SelectItem value="Completed">Hoàn thành (Completed)</SelectItem>
                  <SelectItem value="Cancelled">Đã huỷ (Cancelled)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="paymentStatus" render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái thanh toán</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái thanh toán" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Unpaid">Chưa thanh toán (Unpaid)</SelectItem>
                  <SelectItem value="Paid">Đã thanh toán (Paid)</SelectItem>
                  <SelectItem value="Refunded">Đã hoàn tiền (Refunded)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </form>
    </Form>
  )
}
