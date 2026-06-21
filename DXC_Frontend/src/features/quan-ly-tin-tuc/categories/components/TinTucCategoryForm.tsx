import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { tinTucCategoryFormSchema, type TinTucCategoryFormData } from '../schemas'

interface TinTucCategoryFormProps {
  formId: string
  initialData?: Partial<TinTucCategoryFormData>
  onSubmit: (data: TinTucCategoryFormData) => void
  isLoading?: boolean
}

export const TinTucCategoryForm = ({ formId, initialData, onSubmit, isLoading }: TinTucCategoryFormProps) => {
  const form = useForm<TinTucCategoryFormData>({
    resolver: zodResolver(tinTucCategoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      displayOrder: initialData?.displayOrder || 0,
      isActive: initialData?.isActive ?? true,
    },
  })

  // Auto generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue('name', name)
    
    // Only auto-generate if slug is empty or matches previous auto-generated version
    if (!form.formState.dirtyFields.slug) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      form.setValue('slug', slug, { shouldValidate: true })
    }
  }

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tên danh mục" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        handleNameChange(e)
                      }}
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn (Slug) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="nhap-ten-danh-muc" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự hiển thị</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                    <FormDescription>
                      Cho phép danh mục này xuất hiện trên hệ thống
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập mô tả về danh mục..." 
                      className="min-h-[100px]"
                      {...field} 
                      value={field.value || ''}
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      </form>
    </Form>
  )
}
