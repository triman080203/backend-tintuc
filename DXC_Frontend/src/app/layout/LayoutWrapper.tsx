import React from 'react'
import { useLocation } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { AuthLayout } from './AuthLayout'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation()

  // Routes cần AuthLayout (không có sidebar)
  const authRoutes = ['/login']
  
  // Nếu là auth route, sử dụng AuthLayout
  if (authRoutes.includes(location.pathname)) {
    return <AuthLayout>{children}</AuthLayout>
  }
  
  // Các routes khác sử dụng MainLayout
  return <MainLayout>{children}</MainLayout>
}
