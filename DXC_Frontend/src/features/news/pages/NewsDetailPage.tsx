import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { useNewsDetail, useDeleteNews } from '../hooks/useNews'
import { buildImageUrl } from '@/features/homestays/utils/imageUrl'

export const NewsDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { data: detailData, isLoading } = useNewsDetail(id as string)
  const deleteMutation = useDeleteNews()

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa tin tức này?')) {
      deleteMutation.mutate(
        { publicId: id as string },
        {
          onSuccess: () => navigate('/news')
        }
      )
    }
  }

  if (isLoading) {
    return (
      <ListPageLayout title="Đang tải..." description="" breadcrumbItems={[]}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </ListPageLayout>
    )
  }

  if (!detailData?.data) {
    return (
      <ListPageLayout title="Không tìm thấy" description="Không tìm thấy tin tức này" breadcrumbItems={[]}>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-500">Tin tức không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => navigate('/news')}>Quay lại danh sách</Button>
        </div>
      </ListPageLayout>
    )
  }

  const news = detailData.data

  return (
    <ListPageLayout
      title="Chi tiết tin tức"
      description={news.title || 'Chi tiết bài viết'}
      breadcrumbItems={[
        { label: 'Quản lý tin tức', href: '/news' },
        { label: 'Chi tiết', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/news')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/news/${id}/edit`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4 text-blue-600" />
            Sửa
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{news.title}</h2>
              {news.slug && <p className="text-gray-500 text-sm mb-4">/{news.slug}</p>}
            </div>

            {news.summary && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Tóm tắt</h3>
                <p className="text-gray-700 leading-relaxed">{news.summary}</p>
              </div>
            )}

            {news.content && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nội dung</h3>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {news.content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chung</h3>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tác giả</dt>
                <dd className="mt-1 text-sm text-gray-900">{news.authorName || 'Chưa cập nhật'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Lượt xem</dt>
                <dd className="mt-1 text-sm text-gray-900">{news.viewCount || 0}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    news.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {news.isActive ? 'Hiển thị' : 'Đã ẩn'}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Thứ tự hiển thị</dt>
                <dd className="mt-1 text-sm text-gray-900">{news.thuTu || 0}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày xuất bản</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {news.publishedAt ? new Date(news.publishedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {news.createdAt ? new Date(news.createdAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ảnh bìa</h3>
            {news.coverImageUrl ? (
              <img
                src={buildImageUrl(news.coverImageUrl)}
                alt="Cover"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <span className="text-sm text-gray-500">Chưa có ảnh bìa</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ListPageLayout>
  )
}

export default NewsDetailPage
