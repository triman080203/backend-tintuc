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
import { useCreateRestaurant, useUpdateRestaurant } from '../hooks/useRestaurants'
import { RestaurantImageUploader } from './RestaurantImageUploader'
import type { RestaurantDto } from '@/api/models'

const restaurantFormSchema = z.object({
  name: z.string()
    .min(1, 'Tên nhà hàng không được để trống')
    .max(200, 'Tên nhà hàng không được vượt quá 200 ký tự'),
  description: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().max(20, 'Số điện thoại không được vượt quá 20 ký tự').optional(),
  operatingHours: z.string().max(100, 'Giờ mở cửa không được vượt quá 100 ký tự').optional(),
  schedule: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  vr360Link: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  category: z.string().max(100, 'Loại hình nhà hàng không được vượt quá 100 ký tự').optional(),
  averagePriceRange: z.string().max(50, 'Khoảng giá không được vượt quá 50 ký tự').optional(),
  imagePublicIds: z.array(z.string()).optional(),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
})

type RestaurantFormData = z.infer<typeof restaurantFormSchema>

interface RestaurantFormProps {
  initialData?: RestaurantDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const RestaurantForm = ({ initialData, onSuccess, onSave }: RestaurantFormProps) => {
  const createMutation = useCreateRestaurant()
  const updateMutation = useUpdateRestaurant()
  const isEditing = !!initialData?.publicId

  const [isImageUploading, setIsImageUploading] = useState(false)

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      phoneNumber: initialData?.phoneNumber || '',
      operatingHours: initialData?.operatingHours || '',
      schedule: initialData?.schedule || '',
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      vr360Link: initialData?.vR360Link || '',
      category: initialData?.category || '',
      averagePriceRange: initialData?.averagePriceRange || '',
      imagePublicIds: initialData?.images?.map((img) => img.imagePublicId || '').filter(Boolean),
      thuTu: initialData?.thuTu ?? undefined,
    },
  })

  const handleImagesUploaded = useCallback((publicIds: string[]) => {
    form.setValue('imagePublicIds', publicIds)
  }, [form])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  const onSubmit = async (data: RestaurantFormData) => {
    if (isImageUploading) {
      return
    }

    const submitData = {
      name: data.name.trim() || null,
      description: data.description?.trim() || null,
      address: data.address?.trim() || null,
      phoneNumber: data.phoneNumber?.trim() || null,
      operatingHours: data.operatingHours?.trim() || null,
      schedule: data.schedule?.trim() || null,
      latitude: data.latitude,
      longitude: data.longitude,
      vR360Link: data.vr360Link?.trim() || null,
      category: data.category?.trim() || null,
      averagePriceRange: data.averagePriceRange?.trim() || null,
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

  // ====== EXPOSE SUBMIT FUNCTION ======
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSubmit, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thông tin cơ bản</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên nhà hàng *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên nhà hàng" {...field} />
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
                    placeholder="Mô tả chi tiết về nhà hàng"
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
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thông tin liên hệ</h3>

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

          <FormField
            control={form.control}
            name="vr360Link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vị trí</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/map" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Operating Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thông tin hoạt động</h3>

          <FormField
            control={form.control}
            name="operatingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ hoạt động</FormLabel>
                <FormControl>
                  <Input placeholder="VD: 09:00 - 22:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lịch hoạt động</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Thứ 2 - Chủ nhật, Đóng cửa Thứ Hai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <Input placeholder="VD: Quán ăn, Nhà hàng, Cà phê" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="averagePriceRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức giá trung bình</FormLabel>
                <FormControl>
                  <Input placeholder="VD: 100k - 200k" {...field} />
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
                    placeholder="VD: 0, 1, 2..."
                    {...field}
                    onChange={(e) => field.onChange(e.target.value !== '' ? parseInt(e.target.value, 10) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Thông tin vị trí</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Ảnh nhà hàng</h3>
          <FormField
            control={form.control}
            name="imagePublicIds"
            render={() => (
              <FormItem>
                <FormControl>
                  <RestaurantImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    onUploadingChange={handleUploadingChange}
                    disabled={createMutation.isPending || updateMutation.isPending}
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

export default RestaurantForm
