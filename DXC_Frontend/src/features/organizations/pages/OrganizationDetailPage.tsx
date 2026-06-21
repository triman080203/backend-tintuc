import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, Building2 } from 'lucide-react'
import { OrganizationProfile } from '../components/OrganizationProfile'
import { useOrganizationDetail } from '../hooks/useOrganizationDetail'

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: organization, isLoading, error } = useOrganizationDetail(id!)

  const handleEdit = () => {
    navigate(`/organizations/${id}/edit`)
  }

  if (error || !organization?.data) {
    return (
      <DetailPageLayout
        objectName="Không tìm thấy"
        breadcrumbItems={[{ label: 'Quản lý Đơn vị', href: '/organizations' }]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organizations')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-8 space-y-4">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy tổ chức</h3>
            <p className="text-muted-foreground mb-4">
              Tổ chức bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const organizationData = organization.data

  return (
    <DetailPageLayout
      title="Quản lý đơn vị"
      description="Quản lý các đơn vị trong hệ thống."
      objectName={organizationData.name || 'Chi tiết tổ chức'}
      breadcrumbItems={[
        { label: 'Quản lý Đơn vị', href: '/organizations' },
        { label: organizationData.name || 'Chi tiết', current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organizations')}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          <ActionBarDivider />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            disabled={isLoading}
            className="gap-2"
          >
            <Edit className="w-4 h-4 text-blue-600" />
            Chỉnh sửa
          </Button>
        </>
      }
    >
      <OrganizationProfile organization={organizationData} />
    </DetailPageLayout>
  )
}
