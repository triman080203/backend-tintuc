import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { IconGroupForm } from '../components/IconGroupForm'
import { useIconGroupDetail } from '../hooks/useIconGroups'

export const IconGroupEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: group, isLoading: isLoadingDetail } = useIconGroupDetail(id || '')

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (isLoadingDetail) return <div>Loading...</div>
  if (!group) return <div>Not found</div>

  return (
    <FormPageLayout
      title="Quản lý nhóm icon"
      description="Quản lý danh sách nhóm icon trong hệ thống"
      formTitle="Chỉnh sửa nhóm icon"
      breadcrumbItems={[
        { label: 'Quản lý nhóm icon', href: '/icon-groups' },
        { label: group.name, href: `/icon-groups/${id}` },
        { label: 'Chỉnh sửa', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/icon-groups/${id}`)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/icon-groups/${id}`)}
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
      <IconGroupForm
        initialData={group}
        onSuccess={() => navigate(`/icon-groups/${id}`)}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
