import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check, AlertCircle } from 'lucide-react'
import { BannerForm } from '../components/BannerForm'
import { useBannerDetail, useUpdateBanner } from '../hooks/useBanners'

export const BannerEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateBanner()
  const submitRef = useRef<(() => void) | null>(null)

  const { data, isLoading, error } = useBannerDetail(id || '')

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (error || !data) {
    return (
      <FormPageLayout
        title="Quản lý banner"
        description="Quản lý danh sách banner trong hệ thống"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý banner', href: '/banners' },
          { label: 'Chỉnh sửa', current: true }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/banners')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy banner
            </h3>
            <p className="text-gray-600 mb-6">
              Banner bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/banners')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </FormPageLayout>
    )
  }

  const banner = data

  return (
    <FormPageLayout
      title="Quản lý banner"
      description="Quản lý danh sách banner trong hệ thống"
      formTitle={`Chỉnh sửa banner: ${banner.title || 'N/A'}`}
      breadcrumbItems={[
        { label: 'Quản lý banner', href: '/banners' },
        { label: banner.title || 'Chi tiết', href: `/banners/${id}` },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/banners/${id}`)}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/banners')}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <BannerForm
        initialData={banner}
        onSuccess={() => navigate('/banners')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
