import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye } from 'lucide-react'
import type { TinTucArticleDto } from '@/api/models'

interface NewsCardProps {
  article: TinTucArticleDto
  featured?: boolean
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const publishDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : 'Chưa cập nhật'

  if (featured) {
    return (
      <Link to={`/baochi/chi-tiet/${article.publicId}`} className="group block relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
          {article.thumbnailUrl ? (
            <img 
              src={article.thumbnailUrl} 
              alt={article.title || 'Thumbnail'} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
              Không có ảnh
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {article.categoryName && (
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
              {article.categoryName}
            </span>
          )}
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-slate-200 text-sm line-clamp-2 mb-3">
              {article.summary}
            </p>
          )}
          <div className="flex items-center text-xs text-slate-300 gap-4">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {publishDate}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount || 0}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/baochi/chi-tiet/${article.publicId}`} className="group flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
        {article.thumbnailUrl ? (
          <img 
            src={article.thumbnailUrl} 
            alt={article.title || 'Thumbnail'} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            Không có ảnh
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {article.categoryName && (
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 block">
            {article.categoryName}
          </span>
        )}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
            {article.summary}
          </p>
        )}
        <div className="flex items-center text-xs text-slate-400 gap-4 mt-auto pt-4 border-t border-slate-50">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {publishDate}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount || 0}</span>
        </div>
      </div>
    </Link>
  )
}
