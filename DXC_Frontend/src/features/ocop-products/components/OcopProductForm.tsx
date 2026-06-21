import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateOcopProduct, useUpdateOcopProduct, useOcopCategoryEnums, useOcopEnterpriseEnums } from '../hooks/useOcopProducts'
import { OcopProductImageUploader } from './OcopProductImageUploader'
import type { OcopProductDto } from '@/api/models'

const formSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống').max(255, 'Tên không vượt quá 255 ký tự'),
  description: z.string().max(1000, 'Mô tả không vượt quá 1000 ký tự').optional(),
  categoryPublicId: z.string().min(1, 'Danh mục là bắt buộc'),
  enterprisePublicId: z.string().min(1, 'Doanh nghiệp là bắt buộc'),
  referencePrice: z.number().gt(0, 'Giá phải > 0').optional(),
  promotionalPrice: z.number().gt(0, 'Giá phải > 0').optional(),
  contactPhone: z.string().max(20, 'Số điện thoại không vượt quá 20 ký tự').regex(/^[0-9+\-\s()]*$/, 'Số điện thoại không đúng định dạng').optional(),
  contactAddress: z.string().max(500, 'Địa chỉ không vượt quá 500 ký tự').optional(),
  latitude: z.number().min(-90, 'Vĩ độ phải trong khoảng -90 đến 90').max(90, 'Vĩ độ phải trong khoảng -90 đến 90').optional(),
  longitude: z.number().min(-180, 'Kinh độ phải trong khoảng -180 đến 180').max(180, 'Kinh độ phải trong khoảng -180 đến 180').optional(),
  imagePublicIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.promotionalPrice && data.referencePrice && data.promotionalPrice > data.referencePrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['promotionalPrice'],
      message: 'Giá khuyến mãi không được lớn hơn giá tham khảo',
    })
  }
})

type FormData = z.infer<typeof formSchema>

interface OcopProductFormProps {
  initialData?: OcopProductDto
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const OcopProductForm = ({ initialData, onSuccess, onSave }: OcopProductFormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreateOcopProduct()
  const updateMutation = useUpdateOcopProduct()
  const [isImageUploading, setIsImageUploading] = React.useState(false)

  const { data: categoryEnums } = useOcopCategoryEnums()
  const { data: enterpriseEnums } = useOcopEnterpriseEnums()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      categoryPublicId: initialData?.category?.publicId || '',
      enterprisePublicId: initialData?.enterprise?.publicId || '',
      referencePrice: initialData?.referencePrice || undefined,
      promotionalPrice: initialData?.promotionalPrice || undefined,
      contactPhone: initialData?.contactPhone || '',
      contactAddress: initialData?.contactAddress || '',
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
      imagePublicIds: [],
      isActive: initialData?.isActive || false,
    },
  })

  const handleImagesUploaded = React.useCallback((publicIds: string[]) => {
    form.setValue('imagePublicIds', publicIds)
  }, [form])

  const handleUploadingChange = React.useCallback((uploading: boolean) => {
    setIsImageUploading(uploading)
  }, [])

  const onSubmit = async (data: FormData) => {
    // Prevent submit during upload
    if (isImageUploading) {
      return
    }

    try {
      const payload = {
        name: data.name,
        description: data.description,
        categoryPublicId: data.categoryPublicId,
        enterprisePublicId: data.enterprisePublicId,
        referencePrice: data.referencePrice,
        promotionalPrice: data.promotionalPrice,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        imagePublicIds: data.imagePublicIds?.length ? data.imagePublicIds : undefined,
      }
      
      if (isEditing) {
        await updateMutation.mutateAsync({
          publicId: initialData!.publicId!,
          ...payload,
          isActive: data.isActive,
        })
      } else {
        await createMutation.mutateAsync(payload)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm <span className="text-red-600">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên sản phẩm..." {...field} disabled={isSubmitting} />
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
                <Textarea placeholder="Nhập mô tả..." rows={4} {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoryPublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(categoryEnums || []).map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enterprisePublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doanh nghiệp</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn doanh nghiệp" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(enterpriseEnums || []).map(ent => (
                      <SelectItem key={ent.value} value={ent.value}>
                        {ent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="referencePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá gốc</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promotionalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá khuyến mãi</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại liên hệ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ liên hệ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ..." {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vĩ độ</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" placeholder="Nhập vĩ độ..." {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')} disabled={isSubmitting} />
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
                  <Input type="number" step="0.000001" placeholder="Nhập kinh độ..." {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Ảnh sản phẩm</h3>
          <FormField
            control={form.control}
            name="imagePublicIds"
            render={() => (
              <FormItem>
                <FormControl>
                  <OcopProductImageUploader
                    onImagesUploaded={handleImagesUploaded}
                    onUploadingChange={handleUploadingChange}
                    disabled={isSubmitting || isImageUploading}
                    existingImages={initialData?.images || []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEditing && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select value={field.value ? 'true' : 'false'} onValueChange={(val) => field.onChange(val === 'true')}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
