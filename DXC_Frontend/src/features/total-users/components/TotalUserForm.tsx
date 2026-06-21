import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { TotalUserFormData, TotalUserTableRow } from '../types'

interface TotalUserFormProps {
  defaultValues?: Partial<TotalUserTableRow>
  onSave?: (submit: () => void) => void
  onSubmit: (values: TotalUserFormData) => void
}

export const TotalUserForm = ({ defaultValues, onSave, onSubmit }: TotalUserFormProps) => {
  const form = useForm<TotalUserFormData>({
    defaultValues: {
      userId: defaultValues?.userId || '',
      username: defaultValues?.username || '',
      avatar: defaultValues?.avatar || '',
      phanQuyen: (defaultValues?.phanQuyen || '').toLowerCase() === 'true',
      phoneNumber: defaultValues?.phoneNumber || '',
    },
  })

  useEffect(() => {
    onSave?.(() => form.handleSubmit(handleSubmit)())
  }, [form, onSave])

  const handleSubmit = (values: TotalUserFormData) => {
    if (!values.userId || !values.username) return
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" aria-label="Form tạo/cập nhật người dùng" role="form">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập UserId" aria-label="UserID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập Username" aria-label="Tên người dùng" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={true}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập Avatar" aria-label="Avatar" />
              </FormControl>
              <FormMessage />
              {form.watch('avatar') && (
                <div className="mt-3 flex items-center gap-3" aria-label="Xem trước avatar">
                  <Avatar>
                    <AvatarImage src={form.watch('avatar') || ''} alt="Avatar xem trước" />
                    <AvatarFallback>{(form.watch('username') || '').slice(0,1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {/* <span className="text-sm text-muted-foreground break-all">{form.watch('avatar')}</span> */}
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phanQuyen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phân quyền</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} aria-label="Phân quyền" />
                  <span className="text-sm text-muted-foreground">Phân quyền danh mục Chính Quyền số</span>
                </div>
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
                <Input {...field} placeholder="Nhập số điện thoại" aria-label="Số điện thoại" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
