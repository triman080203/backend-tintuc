import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBaoChiNewsDetail, useBaoChiNewsList } from '../hooks/useBaoChiData'
import { Loader2, Clock, User, Eye, ChevronRight, Tag } from 'lucide-react'
import { NewsCard } from '../components/NewsCard'

export const BaoChiDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useBaoChiNewsDetail(id || '')
  const article = data?.data

  // Fetch related news (same category)
  const { data: relatedData } = useBaoChiNewsList({ 
    CategoryId: article?.categoryId,
    PageSize: 4 
  })
  const relatedArticles = relatedData?.data?.filter(a => a.publicId !== id) || []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy bài viết</h2>
        <p className="text-slate-500 mb-6">Bài viết có thể đã bị xóa hoặc thu hồi.</p>
        <button 
          onClick={() => navigate('/baochi')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  const publishDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : 'Chưa cập nhật'

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-8">
        <Link to="/baochi" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        {article.categoryName && (
          <>
            <span className="text-slate-900 font-medium">{article.categoryName}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-2 space-y-8">
          <header className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-6 border-b border-slate-200">
              {article.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-slate-700">{article.authorName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount || 0} lượt xem</span>
              </div>
            </div>
          </header>

          {article.summary && (
            <p className="text-lg text-slate-700 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4">
              {article.summary}
            </p>
          )}

          {article.content ? (
            <div 
              className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl prose-img:w-full prose-a:text-blue-600 hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-center text-slate-500 italic">Nội dung đang được cập nhật...</p>
          )}

          {article.tags && (
            <div className="pt-8 flex flex-wrap items-center gap-3">
              <Tag className="w-5 h-5 text-slate-400" />
              {article.tags.split(',').map(tag => (
                <span key={tag.trim()} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 cursor-pointer transition-colors">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {relatedArticles.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide">Cùng chuyên mục</h3>
              </div>
              <div className="flex flex-col gap-6">
                {relatedArticles.map(rel => (
                  <NewsCard key={rel.id} article={rel} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
