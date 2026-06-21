import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Activity,
  UserPlus,
  UserCheck,
  UserX,
  Settings,
  LogIn,
  LogOut,
  Shield
} from 'lucide-react'
import type { UserWithRolesDto } from '@/api/models'

interface UserActivityProps {
  user: UserWithRolesDto
}

interface ActivityItem {
  id: string
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'status_change' | 'role_change'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  status: 'success' | 'warning' | 'error' | 'info'
}

export const UserActivity: React.FC<UserActivityProps> = ({ user }) => {
  // Mock activity data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'create',
      title: 'Tài khoản được tạo',
      description: 'Người dùng đã được tạo thành công trong hệ thống',
      timestamp: user.createdAt || new Date().toISOString(),
      icon: <UserPlus className="h-4 w-4" />,
      status: 'success'
    },
    {
      id: '2',
      type: 'status_change',
      title: `Trạng thái: ${user.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}`,
      description: `Tài khoản được ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      icon: user.isActive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />,
      status: user.isActive ? 'success' : 'warning'
    },
    {
      id: '3',
      type: 'login',
      title: 'Đăng nhập thành công',
      description: 'Người dùng đã đăng nhập vào hệ thống',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      icon: <LogIn className="h-4 w-4" />,
      status: 'info'
    },
    {
      id: '4',
      type: 'role_change',
      title: 'Cập nhật vai trò',
      description: 'Vai trò của người dùng đã được cập nhật',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      icon: <Shield className="h-4 w-4" />,
      status: 'info'
    }
  ]

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-4 w-4" />
      case 'logout':
        return <LogOut className="h-4 w-4" />
      case 'create':
        return <UserPlus className="h-4 w-4" />
      case 'update':
        return <Settings className="h-4 w-4" />
      case 'delete':
        return <UserX className="h-4 w-4" />
      case 'status_change':
        return <Activity className="h-4 w-4" />
      case 'role_change':
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Vừa xong'
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else if (diffInHours < 48) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
        <CardDescription>
          Lịch sử hoạt động và thay đổi của người dùng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có hoạt động nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}