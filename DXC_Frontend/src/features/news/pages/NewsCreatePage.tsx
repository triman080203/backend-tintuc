import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { NewsForm } from '../components/NewsForm'

export const NewsCreatePage = () => {
  const navigate = useNavigate()
  const submitRef = useRef<(() => void) | null>(null)

  return (
    <ListPageLayout
      title="Thêm mới tin tức"
      description="Tạo bài viết mới trong hệ thống"
      breadcrumbItems={[
        { label: 'Quản lý tin tức', href: '/news' },
        { label: 'Thêm mới', current: true },
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
          onSuccess={() => navigate('/news')}
          onSave={(submit) => { submitRef.current = submit }}
        />
      </div>
    </ListPageLayout>
  )
}

export default NewsCreatePage
