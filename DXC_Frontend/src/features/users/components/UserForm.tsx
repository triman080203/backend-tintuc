import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { useRoles } from '../hooks/useRoles'
import { useCreateUser, useUpdateUser, useResetUserPassword } from '../hooks/useUsers'
import type { UserDto } from '@/api/models'

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  return strength
}

const userFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Tên đầy đủ phải có ít nhất 2 ký tự')
    .max(100, 'Tên đầy đủ không được vượt quá 100 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng'),
  userName: z.string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
  email: z.string()
    .email('Email không hợp lệ')
    .max(100, 'Email không được vượt quá 100 ký tự'),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  isActive: z.boolean().optional(),
  roleCodes: z.array(z.string()).optional(),
}).refine((data) => {
  // Only validate password when creating new user
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
}).refine((data) => {
  // Only validate password strength when creating new user
  if (data.password) {
    return data.password.length >= 8 &&
           /[a-z]/.test(data.password) &&
           /[A-Z]/.test(data.password) &&
           /[0-9]/.test(data.password)
  }
  return true
}, {
  message: "Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số",
  path: ["password"],
})

type UserFormData = z.infer<typeof userFormSchema>

interface UserFormProps {
  user?: UserDto
  onSuccess?: () => void
  onCancel?: () => void
  onSave?: (submit: () => void) => void
}

export const UserForm = ({ user, onSuccess, onSave }: UserFormProps) => {
  const isEditing = !!user
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data: rolesResponse } = useRoles()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const resetPasswordMutation = useResetUserPassword()

  const roles = rolesResponse?.data || []

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      userName: user?.userName || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      isActive: user?.isActive ?? true,
      roleCodes: user?.roleCodes || [],
    },
  })

  const password = form.watch('password')
  const passwordStrength = password ? checkPasswordStrength(password) : 0

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return 'Rất yếu'
    if (strength < 50) return 'Yếu'
    if (strength < 75) return 'Trung bình'
    return 'Mạnh'
  }

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing) {
        await updateUserMutation.mutateAsync({
          publicId: user!.publicId!,
          fullName: data.fullName.trim() === '' ? null : data.fullName,
          email: data.email.trim() === '' ? null : data.email,
          isActive: data.isActive,
          roleCodes: data.roleCodes && data.roleCodes.length > 0 ? data.roleCodes : null,
        })
        if (data.password && data.password.length >= 8) {
          await resetPasswordMutation.mutateAsync({
            publicId: user!.publicId!,
            newPassword: data.password,
          })
        }
      } else {
        await createUserMutation.mutateAsync({
          fullName: data.fullName,
          userName: data.userName,
          email: data.email,
          password: data.password!,
          roleCodes: data.roleCodes,
        })
      }
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  // ====== EXPOSE SUBMIT FUNCTION ======
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave, onSubmit])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-primary">Thông tin cơ bản</h3>
                <p className="text-sm text-muted-foreground">Thông tin cá nhân và tài khoản</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đầy đủ *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên đầy đủ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên đăng nhập"
                          {...field}
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                      {isEditing && (
                        <p className="text-xs text-muted-foreground">
                          Không thể thay đổi tên đăng nhập
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
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
                      <div className="text-sm text-muted-foreground">
                        Cho phép người dùng đăng nhập vào hệ thống
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Bảo mật */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-primary">Bảo mật</h3>
                <p className="text-sm text-muted-foreground">Cài đặt mật khẩu và bảo mật</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEditing ? 'Mật khẩu mới' : 'Mật khẩu *'}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={isEditing ? "Nhập mật khẩu mới (tuỳ chọn)" : "Nhập mật khẩu"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      {password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Độ mạnh mật khẩu:</span>
                            <span className={passwordStrength >= 75 ? 'text-green-600' :
                                           passwordStrength >= 50 ? 'text-yellow-600' :
                                           passwordStrength >= 25 ? 'text-orange-600' : 'text-red-600'}>
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <Progress
                            value={passwordStrength}
                            className="h-2"
                          />
                          <div className="flex items-center space-x-2 text-xs">
                            {passwordStrength >= 75 ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>Ít nhất 8 ký tự</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            {/[A-Z]/.test(password) ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>Chứa chữ hoa</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            {/[a-z]/.test(password) ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>Chứa chữ thường</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs">
                            {/[0-9]/.test(password) ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>Chứa số</span>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isEditing ? 'Xác nhận mật khẩu mới' : 'Xác nhận mật khẩu *'}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={isEditing ? "Nhập lại mật khẩu mới (tuỳ chọn)" : "Nhập lại mật khẩu"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Phân quyền */}
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-primary">Phân quyền</h3>
                <p className="text-sm text-muted-foreground">Vai trò và quyền hạn của người dùng</p>
              </div>

              <div className="space-y-3">
                <Label>Vai trò và quyền hạn</Label>
                <div className="text-sm text-muted-foreground">
                  Chọn các vai trò phù hợp cho người dùng này
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <FormField
                      key={role.publicId}
                      control={form.control}
                      name="roleCodes"
                      render={({ field }) => {
                        const isChecked = field.value?.includes(role.code!) || false
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const currentRoles = field.value || []
                                  if (e.target.checked) {
                                    field.onChange([...currentRoles, role.code!])
                                  } else {
                                    field.onChange(currentRoles.filter(code => code !== role.code))
                                  }
                                }}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">
                                {role.name}
                              </FormLabel>
                              {role.description && (
                                <p className="text-sm text-muted-foreground">
                                  {role.description}
                                </p>
                              )}
                            </div>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

      </form>
    </Form>
  )
}
