import React, { useCallback, useState } from 'react'
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
import { useCreateHotel, useUpdateHotel } from '../hooks/useHotels'
import { HotelImageUploader } from './HotelImageUploader'
import type { HotelWithImagesDto } from '@/api/models'

const hotelFormSchema = z.object({
  name: z.string()
    .min(1, 'Tên khách sạn không được để trống')
    .max(200, 'Tên khách sạn không được vượt quá 200 ký tự'),
  description: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  website: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  starRating: z.number().min(0).max(5).optional(),
  operatingHours: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  vr360Link: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  priceFrom: z.number().min(0).optional(),
  priceFromCurrency: z.string().optional(),
  imagePublicIds: z.array(z.string()).optional(),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
})

type HotelFormData = z.infer<typeof hotelFormSchema>

interface HotelFormProps {
  initialData?: HotelWithImagesDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const HotelForm = ({ initialData, onSuccess, onSave }: HotelFormProps) => {
  const createMutation = useCreateHotel()
  const updateMutation = useUpdateHotel()
  const isEditing = !!initialData?.publicId

  const [isImageUploading, setIsImageUploading] = useState(false)

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      website: initialData?.website || '',
      starRating: initialData?.starRating ?? undefined,
      operatingHours: initialData?.operatingHours || '',
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      vr360Link: initialData?.vr360Link || '',
      priceFrom: initialData?.priceFrom ?? undefined,
      priceFromCurrency: initialData?.priceFromCurrency || 'VND',
      imagePublicIds: initialData?.images?.map((img) => img.imagePublicId || '').filter(Boolean),
      thuTu: initialData?.thuTu ?? undefined,
    },
  })

  const onSubmit = (data: HotelFormData) => {
    // Không submit nếu đang upload ảnh
    if (isImageUploading) {
      return
    }

    const submitData = {
      name: data.name.trim() || null,
      description: data.description?.trim() || null,
      address: data.address?.trim() || null,
      phoneNumber: data.phoneNumber?.trim() || null,
      email: data.email?.trim() || null,
      website: data.website?.trim() || null,
      starRating: data.starRating,
      operatingHours: data.operatingHours?.trim() || null,
      latitude: data.latitude,
      longitude: data.longitude,
      vR360Link: data.vr360Link?.trim() || null,
      priceFrom: data.priceFrom,
      priceFromCurrency: data.priceFromCurrency?.trim() || null,
      imagePublicIds: data.imagePublicIds && data.imagePublicIds.length > 0 ? data.imagePublicIds : null,
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
      createMutation.mutate(submitData, {
        onSuccess: () => {
          onSuccess?.()
          form.reset()
        },
      })
    }
  }

  const isPending = isEditing ? updateMutation.isPending : createMutation.isPending

  // Stable callbacks - form.setValue is stable, so no dependencies needed
  const handleImagesUploaded = useCallback((publicIds: string[]) => {
    form.setValue('imagePublicIds', publicIds)
  }, [])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  // ====== EXPOSE SUBMIT FUNCTION ======
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSubmit, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              {/* <h3 className="text-sm font-semibold text-gray-900">Thông tin cơ bản</h3> */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách sạn *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên khách sạn" {...field} />
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
                        placeholder="Mô tả chi tiết về khách sạn"
                        className="resize-none"
                        {...field}
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
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thuTu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        placeholder="VD: 0, 1, 2..."
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val !== '' ? parseInt(val, 10) : undefined)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="starRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xếp hạng sao</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        placeholder="0-5"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* <h3 className="text-sm font-semibold text-gray-900">Thông tin liên hệ</h3> */}

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="operatingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ hoạt động</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 06:00 - 23:00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              {/* <h3 className="text-sm font-semibold text-gray-900">Thông tin vị trí</h3> */}

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Vĩ độ"
                          step="0.000001"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                          placeholder="Kinh độ"
                          step="0.000001"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <FormField
                control={form.control}
                name="vr360Link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link vị trí</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/map" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              {/* <h3 className="text-sm font-semibold text-gray-900">Giá phòng</h3> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceFrom"  
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá phòng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Giá phòng"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceFromCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiền tệ</FormLabel>
                      <FormControl>
                        <Input placeholder="VND" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Ảnh khách sạn</h3>
              <FormField
                control={form.control}
                name="imagePublicIds"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <HotelImageUploader
                        onImagesUploaded={handleImagesUploaded}
                        onUploadingChange={handleUploadingChange}
                        disabled={isPending}
                        existingImages={initialData?.images || []}
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
