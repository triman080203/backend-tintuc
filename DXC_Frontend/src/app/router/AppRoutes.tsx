import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { LoginPage } from '@/features/identity/pages/LoginPage'
import { ChangePasswordPage } from '@/features/identity/pages/ChangePasswordPage'
import { MyProfilePage } from '@/features/profile/pages/MyProfilePage'
import { UserListPage, UserCreatePage, UserDetailPage, UserEditPage } from '@/features/users'
import { RoleListPage, RoleCreatePage, RoleDetailPage, RoleEditPage } from '@/features/roles'
import {
  FeedbackListPage,
  FeedbackCreatePage,
  FeedbackEditPage,
 FeedbackDetailPage,
  FeedbackProcessingPage,
  FeedbackApprovalPage,
  FeedbackPublicPage,
  FeedbackRejectedPage,
} from '@/features/feedback'
import {
  FeedbackTrackingListPage,
  FeedbackTrackingDetailPage
} from '@/features/feedback-tracking'
import { DashboardPage } from '@/features/dashboard'
import { OrganizationListPage, OrganizationCreatePage, OrganizationDetailPage, OrganizationEditPage } from '@/features/organizations'
import { DepartmentListPage, DepartmentCreatePage, DepartmentDetailPage, DepartmentEditPage, DepartmentUsersPage } from '@/features/departments'
import { HotelListPage, HotelCreatePage, HotelDetailPage, HotelEditPage } from '@/features/hotels'
import { RestaurantListPage, RestaurantCreatePage, RestaurantDetailPage, RestaurantEditPage } from '@/features/restaurants'
import { HomestayListPage, HomestayDetailPage, HomestayCreatePage, HomestayEditPage } from '@/features/homestays'
import { OcopCategoryListPage, OcopCategoryCreatePage, OcopCategoryDetailPage, OcopCategoryEditPage } from '@/features/ocop-categories'
import { OcopEnterpriseListPage, OcopEnterpriseCreatePage, OcopEnterpriseDetailPage, OcopEnterpriseEditPage } from '@/features/ocop-enterprises'
import { OcopProductListPage, OcopProductCreatePage, OcopProductDetailPage, OcopProductEditPage } from '@/features/ocop-products'
import { HotlineCategoryListPage, HotlineCategoryCreatePage, HotlineCategoryDetailPage, HotlineCategoryEditPage } from '@/features/hotline-categories'
import { HotlineListPage, HotlineCreatePage, HotlineDetailPage, HotlineEditPage } from '@/features/hotlines'
import { SupportGroupCategoryListPage, SupportGroupCategoryDetailPage, SupportGroupCategoryCreatePage, SupportGroupCategoryEditPage } from '@/features/support-group-categories'
import { SupportGroupListPage, SupportGroupDetailPage, SupportGroupCreatePage, SupportGroupEditPage } from '@/features/support-groups'
import { BannerListPage, BannerDetailPage, BannerCreatePage, BannerEditPage } from '@/features/banners'
import { TotalUserListPage, TotalUserCreatePage, TotalUserDetailPage, TotalUserEditPage } from '@/features/total-users'
import { IconCategoryListPage, IconCategoryCreatePage, IconCategoryDetailPage, IconCategoryEditPage } from '@/features/icon-categories'
import { IconGroupListPage, IconGroupCreatePage, IconGroupDetailPage, IconGroupEditPage } from '@/features/icon-groups'
import { IconListPage, IconCreatePage, IconDetailPage, IconEditPage } from '@/features/icons'
import { KhaoSatListPage, KhaoSatCreatePage, KhaoSatDetailPage, KhaoSatEditPage, KhaoSatStatisticsPage } from '@/features/khaosat'
import { NewsListPage, NewsCreatePage, NewsDetailPage, NewsEditPage } from '@/features/news'
import { TourListPage, TourCreatePage, TourDetailPage, TourEditPage } from '@/features/tours'
import { OrderListPage, OrderDetailPage, OrderEditPage } from '@/features/orders'
import { TicketListPage, TicketCreatePage, TicketDetailPage, TicketEditPage } from '@/features/tickets'

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export const AppRoutes = () => {
  const location = useLocation()
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <div key={location.pathname}>
        <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <UserCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute>
              <UserEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RoleListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles/:id"
          element={
            <ProtectedRoute>
              <RoleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles/create"
          element={
            <ProtectedRoute>
              <RoleCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles/:id/edit"
          element={
            <ProtectedRoute>
              <RoleEditPage />
            </ProtectedRoute>
          }
        />
        
        {/* Organizations routes */}
        <Route
          path="/organizations"
          element={
            <ProtectedRoute>
              <OrganizationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/create"
          element={
            <ProtectedRoute>
              <OrganizationCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/:id"
          element={
            <ProtectedRoute>
              <OrganizationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/:id/edit"
          element={
            <ProtectedRoute>
              <OrganizationEditPage />
            </ProtectedRoute>
          }
        />
        
        {/* Departments routes */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DepartmentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/create"
          element={
            <ProtectedRoute>
              <DepartmentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/:id"
          element={
            <ProtectedRoute>
              <DepartmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/:id/edit"
          element={
            <ProtectedRoute>
              <DepartmentEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/:id/users"
          element={
            <ProtectedRoute>
              <DepartmentUsersPage />
            </ProtectedRoute>
          }
        />
        
        {/* Hotels routes */}
        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <HotelListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/create"
          element={
            <ProtectedRoute>
              <HotelCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <HotelDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:id/edit"
          element={
            <ProtectedRoute>
              <HotelEditPage />
            </ProtectedRoute>
          }
        />

        {/* Restaurants routes */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/create"
          element={
            <ProtectedRoute>
              <RestaurantCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id/edit"
          element={
            <ProtectedRoute>
              <RestaurantEditPage />
            </ProtectedRoute>
          }
        />

        {/* Homestays routes */}
        <Route
          path="/homestays"
          element={
            <ProtectedRoute>
              <HomestayListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homestays/create"
          element={
            <ProtectedRoute>
              <HomestayCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homestays/:id"
          element={
            <ProtectedRoute>
              <HomestayDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homestays/:id/edit"
          element={
            <ProtectedRoute>
              <HomestayEditPage />
            </ProtectedRoute>
          }
        />

        {/* OCOP Categories routes */}
        <Route
          path="/ocop-categories"
          element={
            <ProtectedRoute>
              <OcopCategoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-categories/create"
          element={
            <ProtectedRoute>
              <OcopCategoryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-categories/:id"
          element={
            <ProtectedRoute>
              <OcopCategoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-categories/:id/edit"
          element={
            <ProtectedRoute>
              <OcopCategoryEditPage />
            </ProtectedRoute>
          }
        />

        {/* OCOP Enterprises routes */}
        <Route
          path="/ocop-enterprises"
          element={
            <ProtectedRoute>
              <OcopEnterpriseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-enterprises/create"
          element={
            <ProtectedRoute>
              <OcopEnterpriseCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-enterprises/:id"
          element={
            <ProtectedRoute>
              <OcopEnterpriseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-enterprises/:id/edit"
          element={
            <ProtectedRoute>
              <OcopEnterpriseEditPage />
            </ProtectedRoute>
          }
        />

        {/* OCOP Products routes */}
        <Route
          path="/ocop-products"
          element={
            <ProtectedRoute>
              <OcopProductListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-products/create"
          element={
            <ProtectedRoute>
              <OcopProductCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-products/:id"
          element={
            <ProtectedRoute>
              <OcopProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocop-products/:id/edit"
          element={
            <ProtectedRoute>
              <OcopProductEditPage />
            </ProtectedRoute>
          }
        />

        {/* Hotline Categories routes */}
        <Route
          path="/hotline-categories"
          element={
            <ProtectedRoute>
              <HotlineCategoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotline-categories/create"
          element={
            <ProtectedRoute>
              <HotlineCategoryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotline-categories/:id"
          element={
            <ProtectedRoute>
              <HotlineCategoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotline-categories/:id/edit"
          element={
            <ProtectedRoute>
              <HotlineCategoryEditPage />
            </ProtectedRoute>
          }
        />

        {/* Icon Categories routes */}
        <Route
          path="/icon-categories"
          element={
            <ProtectedRoute>
              <IconCategoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-categories/create"
          element={
            <ProtectedRoute>
              <IconCategoryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-categories/:id"
          element={
            <ProtectedRoute>
              <IconCategoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-categories/:id/edit"
          element={
            <ProtectedRoute>
              <IconCategoryEditPage />
            </ProtectedRoute>
          }
        />

        {/* Icon Groups routes */}
        <Route
          path="/icon-groups"
          element={
            <ProtectedRoute>
              <IconGroupListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-groups/create"
          element={
            <ProtectedRoute>
              <IconGroupCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-groups/:id"
          element={
            <ProtectedRoute>
              <IconGroupDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icon-groups/:id/edit"
          element={
            <ProtectedRoute>
              <IconGroupEditPage />
            </ProtectedRoute>
          }
        />

        {/* Icons routes */}
        <Route
          path="/icons"
          element={
            <ProtectedRoute>
              <IconListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icons/create"
          element={
            <ProtectedRoute>
              <IconCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icons/:id"
          element={
            <ProtectedRoute>
              <IconDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/icons/:id/edit"
          element={
            <ProtectedRoute>
              <IconEditPage />
            </ProtectedRoute>
          }
        />

        {/* KhaoSat routes */}
        <Route
          path="/khaosat"
          element={
            <ProtectedRoute>
              <KhaoSatListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/khaosat/create"
          element={
            <ProtectedRoute>
              <KhaoSatCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/khaosat/:id"
          element={
            <ProtectedRoute>
              <KhaoSatDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/khaosat/:id/edit"
          element={
            <ProtectedRoute>
              <KhaoSatEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/khaosat/statistics"
          element={
            <ProtectedRoute>
              <KhaoSatStatisticsPage />
            </ProtectedRoute>
          }
        />
        {/* Hotlines routes */}
        <Route
          path="/hotlines"
          element={
            <ProtectedRoute>
              <HotlineListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotlines/create"
          element={
            <ProtectedRoute>
              <HotlineCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotlines/:id"
          element={
            <ProtectedRoute>
              <HotlineDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotlines/:id/edit"
          element={
            <ProtectedRoute>
              <HotlineEditPage />
            </ProtectedRoute>
          }
        />

        {/* Support Groups routes */}
        <Route
          path="/support-groups"
          element={
            <ProtectedRoute>
              <SupportGroupListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-groups/create"
          element={
            <ProtectedRoute>
              <SupportGroupCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-groups/:id"
          element={
            <ProtectedRoute>
              <SupportGroupDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-groups/:id/edit"
          element={
            <ProtectedRoute>
              <SupportGroupEditPage />
            </ProtectedRoute>
          }
        />
        
        {/* Support Group Categories routes */}
        <Route
          path="/support-group-categories"
          element={
            <ProtectedRoute>
              <SupportGroupCategoryListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-group-categories/create"
          element={
            <ProtectedRoute>
              <SupportGroupCategoryCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-group-categories/:id"
          element={
            <ProtectedRoute>
              <SupportGroupCategoryDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-group-categories/:id/edit"
          element={
            <ProtectedRoute>
              <SupportGroupCategoryEditPage />
            </ProtectedRoute>
          }
        />

        {/* Banners routes */}
        <Route
          path="/banners"
          element={
            <ProtectedRoute>
              <BannerListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/banners/create"
          element={
            <ProtectedRoute>
              <BannerCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/banners/:id"
          element={
            <ProtectedRoute>
              <BannerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/banners/:id/edit"
          element={
            <ProtectedRoute>
              <BannerEditPage />
            </ProtectedRoute>
          }
        />

        {/* Total Users routes */}
        <Route
          path="/total-users"
          element={
            <ProtectedRoute>
              <TotalUserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-users/create"
          element={
            <ProtectedRoute>
              <TotalUserCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-users/:id"
          element={
            <ProtectedRoute>
              <TotalUserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-users/:id/edit"
          element={
            <ProtectedRoute>
              <TotalUserEditPage />
            </ProtectedRoute>
          }
        />

        {/* Orders routes */}
        <Route path="/orders" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/orders/:id/edit" element={<ProtectedRoute><OrderEditPage /></ProtectedRoute>} />

        {/* Tours routes */}
        <Route path="/tours" element={<ProtectedRoute><TourListPage /></ProtectedRoute>} />
        <Route path="/tours/create" element={<ProtectedRoute><TourCreatePage /></ProtectedRoute>} />
        <Route path="/tours/:id" element={<ProtectedRoute><TourDetailPage /></ProtectedRoute>} />
        <Route path="/tours/:id/edit" element={<ProtectedRoute><TourEditPage /></ProtectedRoute>} />

        {/* Tickets routes */}
        <Route path="/tickets" element={<ProtectedRoute><TicketListPage /></ProtectedRoute>} />
        <Route path="/tickets/create" element={<ProtectedRoute><TicketCreatePage /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/tickets/:id/edit" element={<ProtectedRoute><TicketEditPage /></ProtectedRoute>} />

        {/* News routes */}
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <NewsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/create"
          element={
            <ProtectedRoute>
              <NewsCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/:id"
          element={
            <ProtectedRoute>
              <NewsDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/:id/edit"
          element={
            <ProtectedRoute>
              <NewsEditPage />
            </ProtectedRoute>
          }
        />

        {/* Feedback routes */}

        <Route
          path="/feedback/create"
          element={
            <ProtectedRoute>
              <FeedbackCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/processing"
          element={
            <ProtectedRoute>
              <FeedbackProcessingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/approval"
          element={
            <ProtectedRoute>
              <FeedbackApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/public"
          element={<FeedbackPublicPage />}
        />
        <Route
          path="/feedback/rejected"
          element={
            <ProtectedRoute>
              <FeedbackRejectedPage />
            </ProtectedRoute>
          }
        />
        {/* Specific detail routes for each feedback feature - MUST come before generic :publicId */}
        <Route
          path="/feedback/public/:publicId"
          element={
            <ProtectedRoute>
              <FeedbackDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/processing/:publicId"
          element={
            <ProtectedRoute>
              <FeedbackDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/approval/:publicId"
          element={
            <ProtectedRoute>
              <FeedbackDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/rejected/:publicId"
          element={
            <ProtectedRoute>
              <FeedbackDetailPage />
            </ProtectedRoute>
          }
        />
        {/* Generic detail routes - fallback after specific ones */}
        <Route
          path="/feedback/:publicId/edit"
          element={
            <ProtectedRoute>
              <FeedbackEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback/:publicId"
          element={
            <ProtectedRoute>
              <FeedbackDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackListPage />
            </ProtectedRoute>
          }
        />
        
        {/* Feedback Tracking routes */}
        <Route
          path="/feedback-tracking"
          element={
            <ProtectedRoute>
              <FeedbackTrackingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback-tracking/:id"
          element={
            <ProtectedRoute>
              <FeedbackTrackingDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Suspense>
  )
}
