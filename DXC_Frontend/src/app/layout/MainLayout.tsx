import React from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { useMobileMenu } from '@/shared/hooks/useMobileMenu'
import { Sidebar } from '@/shared/components/Sidebar'
import { AppHeader } from '@/shared/components/AppHeader'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, isMobile } = useMobileMenu()

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        user={user} 
        onLogout={logout}
        onToggleMobileMenu={toggleMobileMenu}
        isMobile={isMobile}
      />

      <div className="flex relative">
        {/* Mobile Backdrop */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar - hidden on mobile by default, visible on desktop */}
        {user && (
          <>
            {isMobile ? (
              <Sidebar
                isMobile={isMobile}
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
              />
            ) : (
              <Sidebar />
            )}
          </>
        )}

        <main className="flex-1 w-full">
          <div className="max-w-[1600px] mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}