import React, { useCallback, useState } from 'react'
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
import { useCreateHomestay, useUpdateHomestay } from '../hooks/useHomestays'
import { HomestayImageUploader } from './HomestayImageUploader'
import type { HomestayDto } from '@/api/models'

// ====== VALIDATION SCHEMA ======
// Define validation rules for form fields - matching CreateHomestayCommand structure
const formSchema = z.object({
  name: z.string().min(1, 'Tên homestay không được để trống').max(200, 'Tên homestay không được vượt quá 200 ký tự'),
  description: z.string().min(1, 'Mô tả không được để trống').max(2000, 'Mô tả không được vượt quá 2000 ký tự'),
  address: z.string().min(1, 'Địa chỉ không được để trống').max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
  phoneNumber: z.string().min(1, 'Số điện thoại không được để trống').regex(/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  linkVitri: z.string().url('Link vị trí không hợp lệ').optional().or(z.literal('')),
  averagePrice: z.number().gt(0, 'Giá trung bình phải lớn hơn 0'),
  latitude: z.number().min(-90, 'Vĩ độ phải nằm trong khoảng -90 đến 90').max(90, 'Vĩ độ phải nằm trong khoảng -90 đến 90').optional(),
  longitude: z.number().min(-180, 'Kinh độ phải nằm trong khoảng -180 đến 180').max(180, 'Kinh độ phải nằm trong khoảng -180 đến 180').optional(),
  isActive: z.boolean().optional(),
  imagePublicIds: z.array(z.string()).optional(),
  thuTu: z.number().int().min(0, 'Thứ tự phải >= 0').optional(),
})

type FormData = z.infer<typeof formSchema>

interface HomestayFormProps {
  initialData?: HomestayDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const HomestayForm = ({
  initialData,
  onSuccess,
  onSave,
}: HomestayFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateHomestay()
  const updateMutation = useUpdateHomestay()
  const [isImageUploading, setIsImageUploading] = useState(false)

  // ====== FORM SETUP ======
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      phoneNumber: initialData?.phoneNumber || '',
      website: initialData?.website || '',
      linkVitri: initialData?.linkVitri || '',
      averagePrice: initialData?.averagePrice ?? undefined,
      latitude: initialData?.latitude ?? undefined,
      longitude: initialData?.longitude ?? undefined,
      isActive: initialData?.isActive ?? true,
      imagePublicIds: initialData?.images?.map(img => img.imagePublicId || '').filter(Boolean) || [],
      thuTu: initialData?.thuTu ?? undefined,
    },
  })

  // ====== IMAGE UPLOAD CALLBACKS ======
  const handleImagesUploaded = useCallback((publicIds: string[]) => {
    form.setValue('imagePublicIds', publicIds)
  }, [form])

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  // ====== FORM SUBMISSION ======
  const onSubmit = async (data: FormData) => {
    // Prevent submit during upload
    if (isImageUploading) {
      return
    }

    try {
      // Transform data to match CreateHomestayCommand/UpdateHomestayCommand structure
      const finalData = {
        name: data.name || null,
        address: data.address || null,
        description: data.description || null,
        phoneNumber: data.phoneNumber || null,
        website: data.website || null,
        linkVitri: data.linkVitri || null,
        averagePrice: data.averagePrice,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        thuTu: typeof data.thuTu === 'number' ? data.thuTu : null,
        imagePublicIds: data.imagePublicIds?.length ? data.imagePublicIds : null,
      }


      if (isEditing) {
        // Update existing - add publicId for UpdateHomestayCommand
        const updateData = {
          publicId: initialData.publicId!,
          name: finalData.name,
          address: finalData.address,
          description: finalData.description,
          phoneNumber: finalData.phoneNumber,
          website: finalData.website,
          linkVitri: finalData.linkVitri,
          averagePrice: finalData.averagePrice,
          latitude: finalData.latitude,
          longitude: finalData.longitude,
          thuTu: finalData.thuTu,
          imagePublicIds: finalData.imagePublicIds,
        }
        // Gọi API update homestay
        await updateMutation.mutateAsync(updateData, {
          onSuccess: () => onSuccess?.()
        })
      } else {
        // Create new
        await createMutation.mutateAsync(finalData, {
          onSuccess: () => onSuccess?.(),
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // ====== EXPOSE SUBMIT FUNCTION ======
  // This allows parent page to trigger submit from action bar
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
                Tên homestay <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên homestay..."
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
                  placeholder="Nhập mô tả homestay..."
                  rows={4}
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== ADDRESS FIELD ===== */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập địa chỉ homestay..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
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
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value !== '' ? parseInt(e.target.value, 10) : undefined)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== PHONE NUMBER FIELD ===== */}
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* ===== WEBSITE AND LOCATION LINK FIELDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkVitri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link vị trí</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://maps.google.com/..."
                    {...field}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ===== PRICE FIELDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="averagePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trung bình</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  placeholder="Nhập giá..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vĩ độ (Latitude)</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  step="any"
                  placeholder="Nhập vĩ độ..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={createMutation.isPending || updateMutation.isPending}
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
                <FormLabel>Kinh độ (Longitude)</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  step="any"
                  placeholder="Nhập kinh độ..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ===== COORDINATES FIELDS ===== */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vĩ độ (Latitude)</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  step="any"
                  placeholder="Nhập vĩ độ..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={createMutation.isPending || updateMutation.isPending}
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
                <FormLabel>Kinh độ (Longitude)</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  step="any"
                  placeholder="Nhập kinh độ..."
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        {/* ===== ACTIVE STATUS FIELD ===== */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Trạng thái hoạt động</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Homestay có đang hoạt động và nhận khách không
                </p>
              </div>
            </FormItem>
          )}
        />

        {/* ===== IMAGE UPLOAD SECTION ===== */}
        <div className="space-y-2">
          <FormLabel>Hình ảnh homestay</FormLabel>
          <HomestayImageUploader
            onImagesUploaded={handleImagesUploaded}
            disabled={createMutation.isPending || updateMutation.isPending}
            onUploadingChange={handleUploadingChange}
            existingImages={initialData?.images || []}
          />
        </div>
      </form>
    </Form>
  )
}

export default HomestayForm
