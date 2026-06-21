import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Menu, User, Settings } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
// import logoTayNinh from '@/assets/logo.png'

interface User {
  publicId?: string | null
  fullName: string | null
  userName: string | null
  email: string | null
  createdAt?: string
  roleCodes?: string[] | null
  departmentPublicId?: string | null
  departmentName?: string | null
  organizationPublicId?: string | null
  organizationName?: string | null
}

interface AppHeaderProps {
  user: User | null
  onLogout: () => void
  onToggleMobileMenu?: () => void
  isMobile?: boolean
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onLogout,
  onToggleMobileMenu,
  isMobile
}) => {
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    onLogout()
    toast.success('Đã đăng xuất thành công')
    navigate('/login', { replace: true })
  }

  const getUserRole = () => {
    if (!user.roleCodes || user.roleCodes.length === 0) return 'Người dùng'
    if (user.roleCodes.includes('admin')) return 'Quản trị viên'
    return 'Người dùng'
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-gray-700 hover:bg-gray-100"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          {/* <img
            src={logoTayNinh}
            alt="Logo"
            className="h-10 w-10"
          /> */}
          <div className="hidden md:block border-l border-gray-300 h-8" />
          <h1 className="hidden md:inline text-lg font-bold text-gray-900">
            Hệ thống quản trị du lịch
          </h1>
        </div>

        {/* User Menu */}
        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-3 hover:bg-gray-100"
              >
                <UserAvatar
                  fullName={user.fullName}
                  userName={user.userName}
                  size="sm"
                />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName || user.userName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRole()}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* User Info Header */}
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 py-2">
                  <UserAvatar
                    fullName={user.fullName}
                    userName={user.userName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {user.fullName || user.userName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {getUserRole()}
                      </Badge>
                    </div>
                  </div>
                </div>
                {(user.departmentName || user.organizationName) && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                    {user.departmentName && (
                      <div className="truncate">📁 {user.departmentName}</div>
                    )}
                    {user.organizationName && (
                      <div className="truncate">🏢 {user.organizationName}</div>
                    )}
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Actions */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate('/my-profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
