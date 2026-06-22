import { Breadcrumb } from '@/shared/components/Breadcrumb'
import { StatsCard } from '../components/StatsCard'
import { QuickActionCard } from '../components/QuickActionCard'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Users,
  ArrowRightLeft,
  FileCheck,
  XCircle,
  Plus,
  Shield,
  Building2,
  Image,
  Archive,
} from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuth()
  const userRoles = user?.roleCodes || []
  const isAdmin = userRoles.includes('admin')
  const { data: statsResult, isLoading: statsLoading } = useDashboardStats()
  const stats = statsResult?.data

  // Helper function to check role access
  const hasRole = (role: string) => isAdmin || userRoles.includes(role)

  // Get current date in Vietnamese format
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // News quick actions with role-based visibility
  const newsActions = [
    {
      id: 'news-list',
      label: 'Tất cả tin bài',
      href: '/tin-tuc',
      icon: ArrowRightLeft,
      iconColor: 'text-blue-600',
      visible: hasRole('bien_tap_vien') || hasRole('tong_bien_tap'),
    },
    {
      id: 'news-pending',
      label: 'Tin bài chờ biên tập',
      href: '/tin-tuc/cho-duyet',
      icon: Clock,
      iconColor: 'text-amber-600',
      visible: hasRole('phong_vien') || hasRole('bien_tap_vien'),
    },
    {
      id: 'news-approved',
      label: 'Tin bài chờ xuất bản',
      href: '/tin-tuc/da-duyet',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      visible: hasRole('phong_vien') || hasRole('bien_tap_vien') || hasRole('tong_bien_tap'),
    },
    {
      id: 'news-published',
      label: 'Tin bài đã xuất bản',
      href: '/tin-tuc/da-xuat-ban',
      icon: FileCheck,
      iconColor: 'text-emerald-600',
      visible: hasRole('tong_bien_tap'),
    },
    {
      id: 'news-archived',
      label: 'Tin bài đã thu hồi',
      href: '/tin-tuc/da-thu-hoi',
      icon: Archive,
      iconColor: 'text-gray-600',
      visible: hasRole('tong_bien_tap'),
    },
    {
      id: 'news-returned',
      label: 'Tin bài chuyển trả',
      href: '/tin-tuc/bi-tra-lai',
      icon: XCircle,
      iconColor: 'text-red-600',
      visible: hasRole('phong_vien') || hasRole('bien_tap_vien') || hasRole('tong_bien_tap'),
    },
    {
      id: 'news-create',
      label: 'Tạo tin bài mới',
      href: '/tin-tuc/create',
      icon: Plus,
      iconColor: 'text-blue-600',
      visible: hasRole('phong_vien') || hasRole('bien_tap_vien') || hasRole('tong_bien_tap'),
    },
  ]

  // Admin quick actions
  const adminActions = [
    {
      id: 'users',
      label: 'Quản lý người dùng',
      href: '/users',
      icon: Users,
      iconColor: 'text-purple-600',
      visible: isAdmin,
    },
    {
      id: 'roles',
      label: 'Quản lý vai trò',
      href: '/roles',
      icon: Shield,
      iconColor: 'text-indigo-600',
      visible: isAdmin,
    },
    {
      id: 'organizations',
      label: 'Quản lý đơn vị',
      href: '/organizations',
      icon: Building2,
      iconColor: 'text-cyan-600',
      visible: isAdmin,
    },
    {
      id: 'banners',
      label: 'Quản lý banner',
      href: '/banners',
      icon: Image,
      iconColor: 'text-pink-600',
      visible: isAdmin,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', current: true }
        ]}
      />

      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Xin chào, {user?.fullName || user?.userName}!
        </h1>
        <p className="text-gray-600">
          Hệ thống quản trị Zalo Mini App · {currentDate}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng số tin bài"
          value={stats?.totalNews ?? '--'}
          icon={MessageSquare}
          iconColor="text-blue-600"
          description="Tất cả tin bài trong hệ thống"
          loading={statsLoading}
        />
        <StatsCard
          title="Chờ biên tập"
          value={stats?.pendingNews ?? '--'}
          icon={Clock}
          iconColor="text-amber-600"
          description="Tin bài đang chờ biên tập"
          loading={statsLoading}
        />
        <StatsCard
          title="Chờ xuất bản"
          value={stats?.approvedNews ?? '--'}
          icon={CheckCircle}
          iconColor="text-green-600"
          description="Tin bài đã biên tập, chờ Tổng biên tập"
          loading={statsLoading}
        />
        <StatsCard
          title="Đã xuất bản"
          value={stats?.publishedNews ?? '--'}
          icon={FileCheck}
          iconColor="text-emerald-600"
          description="Tin bài đã được xuất bản công khai"
          loading={statsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionCard
          title="Quản lý tin tức"
          actions={newsActions}
        />
        <QuickActionCard
          title="Quản lý hệ thống"
          actions={adminActions}
        />
      </div>
    </div>
  )
}