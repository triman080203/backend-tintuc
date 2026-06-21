import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import HotlineForm, { type HotlineFormHandle } from '../components/HotlineForm'
import { useHotlineDetail } from '../hooks/useHotlines'

export const HotlineEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const submitRef = useRef<HotlineFormHandle>(null)
  const { data, isLoading } = useHotlineDetail(id || '')

  const handleSave = () => {
    submitRef.current?.submit()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (!data?.data) {
    return (
      <FormPageLayout
        title="Quản lý Hotline"
        description="Quản lý tất cả hotline trong hệ thống"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý Hotline', href: '/hotlines' },
          { label: 'Sửa', current: true },
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotlines')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12">
          <p className="text-gray-600">Hotline này không tồn tại</p>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý Hotline"
      description="Quản lý tất cả hotline trong hệ thống"
      formTitle={`Sửa: ${data.data.contactName || 'Hotline'}`}
      breadcrumbItems={[
        { label: 'Quản lý Hotline', href: '/hotlines' },
        { label: 'Sửa', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotlines')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/hotlines')}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            Lưu
          </Button>
        </>
      }
    >
      <HotlineForm
        initialData={data.data}
        ref={submitRef}
        onSuccess={() => navigate('/hotlines')}
      />
    </FormPageLayout>
  )
}

export default HotlineEditPage
