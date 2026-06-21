import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { OcopProductForm } from '../components/OcopProductForm'
import { useCreateOcopProduct } from '../hooks/useOcopProducts'

export const OcopProductCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateOcopProduct()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) submitRef.current()
  }

  return (
    <FormPageLayout
      title="Quản lý sản phẩm OCOP"
      description="Tạo sản phẩm OCOP mới"
      formTitle="Tạo sản phẩm mới"
      breadcrumbItems={[
        { label: 'Quản lý sản phẩm OCOP', href: '/ocop-products' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ocop-products')}
            disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <OcopProductForm
        onSuccess={() => navigate('/ocop-products')}
        onSave={(submit) => { submitRef.current = submit }}
      />
    </FormPageLayout>
  )
}

export default OcopProductCreatePage
