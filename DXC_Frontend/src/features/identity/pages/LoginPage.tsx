import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/shared/hooks/useAuth'
import { getIdentity } from '@/api/endpoints/identity'

type LoginFormData = {
  userName: string
  password: string
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const identityApi = getIdentity()
      const response = await identityApi.postApiIdentityLogin(data)

      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }

      return response.data
    },
    onSuccess: (loginResult) => {
      if (loginResult?.accessToken) {
        // Lấy thông tin user sau khi đăng nhập thành công
        getCurrentUser(loginResult.accessToken)
      } else {
        throw new Error('Không nhận được token đăng nhập')
      }
    },
    onError: (error: Error) => {
      toast.error('Đăng nhập thất bại', {
        description: error.message,
      })
    },
  })

  const getCurrentUser = async (token: string) => {
    try {
      // TẠM THỜI: Lưu token trực tiếp vào sessionStorage trước khi gọi API
      // Điều này đảm bảo request interceptor có thể tìm thấy token
      sessionStorage.setItem('auth_token', token)

      const identityApi = getIdentity()
      const response = await identityApi.getApiIdentityCurrentUser()

      if (response.success && response.data) {
        // Sử dụng AuthProvider để lưu token và user data
        login(token, response.data)
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${response.data.fullName}!`,
        })
        navigate('/dashboard')
      } else {
        throw new Error(response.message || 'Không thể lấy thông tin người dùng')
      }
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin người dùng', {
        description: (error as Error).message,
      })
    }
  }

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-white/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Đăng nhập</CardTitle>
        <CardDescription className="text-gray-600">
          Nhập thông tin đăng nhập để truy cập hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-gray-700">Tên đăng nhập</Label>
            <Input
              id="userName"
              type="text"
              placeholder="Nhập tên đăng nhập"
              {...register('userName', { required: 'Tên đăng nhập không được để trống' })}
              className={`bg-white/80 border-gray-300 ${errors.userName ? 'border-red-500' : 'focus:border-ring'}`}
            />
            {errors.userName && (
              <p className="text-sm text-red-500">{errors.userName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              {...register('password', { required: 'Mật khẩu không được để trống' })}
              className={`bg-white/80 border-gray-300 ${errors.password ? 'border-red-500' : 'focus:border-ring'}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}