import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useBaoChiCategories } from '../hooks/useBaoChiData'

export const BaoChiHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { data: categoriesData } = useBaoChiCategories({ PageSize: 10 })
  const categories = categoriesData?.data || []

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/baochi" className="text-2xl font-bold text-blue-800 tracking-tight">
              BÁO CHÍ <span className="text-red-600">ĐIỆN TỬ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/baochi" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">
              Trang chủ
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/baochi/chuyen-muc/${cat.publicId}`}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 hover:text-blue-600 transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/login" className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
              Đăng nhập
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/baochi"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/baochi/chuyen-muc/${cat.publicId}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập quản trị
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
