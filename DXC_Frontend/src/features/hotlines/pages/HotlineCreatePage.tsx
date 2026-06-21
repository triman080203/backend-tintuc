import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import HotlineForm, { type HotlineFormHandle } from '../components/HotlineForm'

export const HotlineCreatePage = () => {
  const navigate = useNavigate()
  const submitRef = useRef<HotlineFormHandle>(null)

  const handleSave = () => {
    submitRef.current?.submit()
  }

  return (
    <FormPageLayout
      title="Quản lý Hotline"
      description="Quản lý tất cả hotline trong hệ thống"
      formTitle="Tạo Hotline mới"
      breadcrumbItems={[
        { label: 'Quản lý Hotline', href: '/hotlines' },
        { label: 'Tạo mới', current: true },
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
        ref={submitRef}
        onSuccess={() => navigate('/hotlines')}
      />
    </FormPageLayout>
  )
}

export default HotlineCreatePage
