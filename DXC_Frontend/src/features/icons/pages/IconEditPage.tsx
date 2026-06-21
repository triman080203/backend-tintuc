import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { IconForm } from '../components/IconForm'
import { useIconDetail } from '../hooks/useIcons'

export const IconEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: icon, isLoading: isLoadingDetail } = useIconDetail(id || '')

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (isLoadingDetail) return <div>Loading...</div>
  if (!icon) return <div>Not found</div>

  return (
    <FormPageLayout
      title="Quản lý icon"
      description="Quản lý danh sách icon trong hệ thống"
      formTitle="Chỉnh sửa icon"
      breadcrumbItems={[
        { label: 'Quản lý icon', href: '/icons' },
        { label: icon.name, href: `/icons/${id}` },
        { label: 'Chỉnh sửa', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/icons/${id}`)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/icons/${id}`)}
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
            Cập nhật
          </Button>
        </>
      }
    >
      <IconForm
        initialData={icon}
        onSuccess={() => navigate(`/icons/${id}`)}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
