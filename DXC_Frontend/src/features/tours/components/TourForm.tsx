import React, { useState } from 'react'
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
import { useCreateTour, useUpdateTour } from '../hooks/useTours'
import { TourImageUploader, type TourImage } from './TourImageUploader'
import type { TourDto } from '@/api/models'

const formSchema = z.object({
  name: z.string().min(1, 'Tên tour không được để trống'),
  description: z.string().optional().or(z.literal('')),
  highlights: z.string().optional().or(z.literal('')),
  schedule: z.string().optional().or(z.literal('')),
  price: z.number().min(0, 'Giá phải >= 0'),
  priceCurrency: z.string().optional().or(z.literal('')),
  durationDays: z.number().int().min(1, 'Số ngày phải >= 1'),
  durationNights: z.number().int().min(0, 'Số đêm phải >= 0'),
  departureLocation: z.string().optional().or(z.literal('')),
  maxParticipants: z.number().int().min(1, 'Số người phải >= 1'),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
  isActive: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

interface TourFormProps {
  initialData?: TourDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const TourForm = ({ initialData, onSuccess, onSave }: TourFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateTour()
  const updateMutation = useUpdateTour()
  
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [images, setImages] = useState<TourImage[]>(
    (initialData?.images || []).map(img => ({
      publicId: img.publicId!,
      imageUrl: img.imageUrl!,
      imagePublicId: img.imagePublicId!,
      displayOrder: img.displayOrder || 0,
      isPrimary: img.isPrimary || false,
      caption: img.caption || undefined
    }))
  )

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      highlights: initialData?.highlights || '',
      schedule: initialData?.schedule || '',
      price: initialData?.price || 0,
      priceCurrency: initialData?.priceCurrency || 'VND',
      durationDays: initialData?.durationDays || 1,
      durationNights: initialData?.durationNights || 0,
      departureLocation: initialData?.departureLocation || '',
      maxParticipants: initialData?.maxParticipants || 1,
      thuTu: initialData?.thuTu || 0,
      isActive: initialData?.isActive ?? true,
    },
  })

  const onSubmit = async (data: FormData) => {
    if (isImageUploading) return

    try {
      const finalData = {
        name: data.name,
        description: data.description || null,
        highlights: data.highlights || null,
        schedule: data.schedule || null,
        price: data.price,
        priceCurrency: data.priceCurrency || null,
        durationDays: data.durationDays,
        durationNights: data.durationNights,
        departureLocation: data.departureLocation || null,
        maxParticipants: data.maxParticipants,
        thuTu: typeof data.thuTu === 'number' ? data.thuTu : 0,
        isActive: data.isActive ?? true,
        images: images.map(img => ({
          publicId: img.publicId.startsWith('temp-') ? null : img.publicId,
          imageUrl: img.imageUrl,
          imagePublicId: img.imagePublicId,
          displayOrder: img.displayOrder,
          isPrimary: img.isPrimary,
          caption: img.caption || null
        }))
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
  }, [form, onSave, images])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên tour *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Giá</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="priceCurrency" render={({ field }) => (
            <FormItem><FormLabel>Đơn vị tiền tệ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="durationDays" render={({ field }) => (
            <FormItem><FormLabel>Số ngày</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="durationNights" render={({ field }) => (
            <FormItem><FormLabel>Số đêm</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="maxParticipants" render={({ field }) => (
            <FormItem><FormLabel>Số người tối đa</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="departureLocation" render={({ field }) => (
            <FormItem><FormLabel>Điểm khởi hành</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Mô tả chi tiết</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="highlights" render={({ field }) => (
          <FormItem><FormLabel>Điểm nổi bật</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="schedule" render={({ field }) => (
          <FormItem><FormLabel>Lịch trình</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="thuTu" render={({ field }) => (
          <FormItem><FormLabel>Thứ tự hiển thị</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="m-0">Kích hoạt</FormLabel></FormItem>
        )} />

        <div className="space-y-2">
          <FormLabel>Hình ảnh Tour</FormLabel>
          <TourImageUploader
            images={images}
            onChange={setImages}
            onUploadingChange={setIsImageUploading}
            disabled={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </form>
    </Form>
  )
}
