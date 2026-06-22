import React from 'react'
import { useParams } from 'react-router-dom'
import { useBaoChiNewsList, useBaoChiCategories } from '../hooks/useBaoChiData'
import { NewsCard } from '../components/NewsCard'
import { Loader2 } from 'lucide-react'

export const BaoChiCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  
  // Need to find the numeric ID of the category from publicId
  const { data: catData } = useBaoChiCategories({ PageSize: 100 })
  const category = catData?.data?.find(c => c.publicId === categoryId)
  
  const { data, isLoading, isError } = useBaoChiNewsList({ 
    CategoryId: category?.id,
    PageSize: 20 
  })
  
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b-4 border-blue-600 pb-4 inline-block">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
          {category?.name || 'Chuyên mục'}
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
          Chưa có tin bài nào trong chuyên mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
