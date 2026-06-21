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

  // Feedback quick actions with role-based visibility
  const feedbackActions = [
    {
      id: 'feedback-list',
      label: 'Điều phối phản ánh',
      href: '/feedback',
      icon: ArrowRightLeft,
      iconColor: 'text-blue-600',
      visible: hasRole('dieu_phoi_phan_anh'),
    },
    {
      id: 'feedback-processing',
      label: 'Xử lý phản ánh',
      href: '/feedback/processing',
      icon: Clock,
      iconColor: 'text-amber-600',
      visible: hasRole('xu_ly_phan_anh'),
    },
    {
      id: 'feedback-approval',
      label: 'Phê duyệt phản ánh',
      href: '/feedback/approval',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      visible: hasRole('phe_duyet_phan_anh'),
    },
    {
      id: 'feedback-public',
      label: 'Phản ánh hoàn thành',
      href: '/feedback/public',
      icon: FileCheck,
      iconColor: 'text-emerald-600',
      visible: hasRole('phan_anh_hoan_thanh'),
    },
    {
      id: 'feedback-rejected',
      label: 'Phản ánh từ chối',
      href: '/feedback/rejected',
      icon: XCircle,
      iconColor: 'text-red-600',
      visible: hasRole('phan_anh_tu_choi'),
    },
    {
      id: 'feedback-create',
      label: 'Tạo phản ánh mới',
      href: '/feedback/create',
      icon: Plus,
      iconColor: 'text-blue-600',
      visible: true,
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
          title="Tổng số phản ánh"
          value={stats?.totalFeedbacks ?? '--'}
          icon={MessageSquare}
          iconColor="text-blue-600"
          description="Tất cả phản ánh trong hệ thống"
          loading={statsLoading}
        />
        <StatsCard
          title="Đang xử lý"
          value={stats?.processingFeedbacks ?? '--'}
          icon={Clock}
          iconColor="text-amber-600"
          description="Phản ánh đang được xử lý"
          loading={statsLoading}
        />
        <StatsCard
          title="Đã phê duyệt"
          value={stats?.approvedFeedbackResponses ?? '--'}
          icon={CheckCircle}
          iconColor="text-green-600"
          description="Phản ánh đã được phê duyệt"
          loading={statsLoading}
        />
        <StatsCard
          title="Người dùng"
          value={stats?.totalUsers ?? '--'}
          icon={Users}
          iconColor="text-purple-600"
          description="Tổng số người dùng"
          loading={statsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionCard
          title="Quản lý phản ánh"
          actions={feedbackActions}
        />
        <QuickActionCard
          title="Quản lý hệ thống"
          actions={adminActions}
        />
      </div>
    </div>
  )
}