import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { NewsForm } from '../components/NewsForm'
import { useNewsDetail } from '../hooks/useNews'

export const NewsEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: detailData, isLoading } = useNewsDetail(id as string)

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

  return (
    <ListPageLayout
      title="Cập nhật tin tức"
      description="Chỉnh sửa thông tin bài viết"
      breadcrumbItems={[
        { label: 'Quản lý tin tức', href: '/news' },
        { label: 'Cập nhật', current: true },
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
            onClick={() => submitRef.current?.()}
            className="gap-2"
          >
            <Save className="w-4 h-4 text-blue-600" />
            Lưu
          </Button>
        </>
      }
    >
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <NewsForm
          initialData={detailData.data}
          onSuccess={() => navigate('/news')}
          onSave={(submit) => { submitRef.current = submit }}
        />
      </div>
    </ListPageLayout>
  )
}

export default NewsEditPage
