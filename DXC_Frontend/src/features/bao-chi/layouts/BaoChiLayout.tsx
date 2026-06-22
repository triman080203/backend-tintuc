import React from 'react'
import { Outlet } from 'react-router-dom'
import { BaoChiHeader } from '../components/BaoChiHeader'
import { BaoChiFooter } from '../components/BaoChiFooter'

export const BaoChiLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <BaoChiHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>
      <BaoChiFooter />
    </div>
  )
}
