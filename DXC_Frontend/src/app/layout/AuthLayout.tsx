import React from 'react'
import bgvideo from '@/assets/bgvideo.mp4'

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgvideo} type="video/mp4" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      </video>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main content - centered with video background */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Hệ thống quản trị du lịch</h1>
            </div>
            <p className="mt-2 text-white/80">Hệ thống quản trị hiện đại</p>
          </div>

          {/* Login form */}
          {children}
        </div>
      </main>
    </div>
  )
}
