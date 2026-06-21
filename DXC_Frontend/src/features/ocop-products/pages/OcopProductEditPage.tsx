import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopProductForm } from '../components/OcopProductForm'
import { useOcopProductDetail, useUpdateOcopProduct } from '../hooks/useOcopProducts'

export const OcopProductEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateOcopProduct()
  const submitRef = useRef<(() => void) | null>(null)

  const { data, isLoading, error } = useOcopProductDetail(id!)

  const handleSave = () => {
    if (submitRef.current) submitRef.current()
  }

  if (error || !data?.data) {
    return (
      <FormPageLayout
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý sản phẩm OCOP', href: '/ocop-products' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-products')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <p className="text-center text-gray-600 py-8">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý sản phẩm OCOP"
      description="Chi tiết sản phẩm OCOP"
      formTitle={`Chỉnh sửa: ${data.data.name}`}
      breadcrumbItems={[
        { label: 'Quản lý sản phẩm OCOP', href: '/ocop-products' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-products')}
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
            onClick={() => navigate('/ocop-products')}
            disabled={updateMutation.isPending || isLoading}
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
      <OcopProductForm
        initialData={data.data}
        onSuccess={() => navigate('/ocop-products')}
        onSave={(submit) => { submitRef.current = submit }}
      />
    </FormPageLayout>
  )
}

export default OcopProductEditPage
