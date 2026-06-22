import React from 'react'
import { useBaoChiNewsList } from '../hooks/useBaoChiData'
import { NewsCard } from '../components/NewsCard'
import { Loader2 } from 'lucide-react'

export const BaoChiHomePage = () => {
  const { data, isLoading, isError } = useBaoChiNewsList({ PageSize: 20 })
  const articles = data?.data || []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
        Đã có lỗi xảy ra khi tải tin tức. Vui lòng thử lại sau.
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có tin bài nào được xuất bản.
      </div>
    )
  }

  const featuredArticle = articles[0]
  const recentArticles = articles.slice(1, 5) // Next 4 for sidebar
  const otherArticles = articles.slice(5) // Rest for bottom grid

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Top Section: Hero & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Hero */}
        <div className="lg:col-span-2">
          {featuredArticle && <NewsCard article={featuredArticle} featured={true} />}
        </div>
        
        {/* Sidebar News */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <h3 className="text-xl font-bold uppercase tracking-wide">Tin mới nhất</h3>
          </div>
          <div className="flex flex-col gap-6">
            {recentArticles.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {otherArticles.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <h3 className="text-xl font-bold uppercase tracking-wide">Đáng chú ý</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherArticles.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
