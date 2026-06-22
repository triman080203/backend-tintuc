import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube } from 'lucide-react'

export const BaoChiFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/baochi" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">
              BÁO CHÍ <span className="text-red-500">ĐIỆN TỬ</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Cơ quan ngôn luận chính thức, cập nhật tin tức nhanh chóng, chính xác và đa chiều về mọi mặt đời sống, kinh tế, xã hội.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>123 Đường Báo Chí, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Hotline: (028) 38 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Email: toasoan@baochidientu.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Chuyên mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/baochi" className="hover:text-white transition-colors">Thời sự</Link></li>
              <li><Link to="/baochi" className="hover:text-white transition-colors">Kinh tế</Link></li>
              <li><Link to="/baochi" className="hover:text-white transition-colors">Xã hội</Link></li>
              <li><Link to="/baochi" className="hover:text-white transition-colors">Văn hóa</Link></li>
              <li><Link to="/baochi" className="hover:text-white transition-colors">Thể thao</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-sky-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Báo Chí Điện Tử. Giấy phép số 123/GP-BTTTT cấp ngày 01/01/2026.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/baochi" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link to="/baochi" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
