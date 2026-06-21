import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { DepartmentForm } from '../components/DepartmentForm'
import { useDepartmentDetail } from '../hooks/useDepartmentDetail'
import { useUpdateDepartment } from '../hooks/useDepartments'

export const DepartmentEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const updateMutation = useUpdateDepartment()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: departmentResponse, isLoading, error } = useDepartmentDetail(id!)
  const department = departmentResponse?.data

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (error || !department) {
    return (
      <FormPageLayout
        title="Quản lý phòng ban"
        description="Quản lý thông tin các phòng ban trong hệ thống"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý phòng ban', href: '/departments' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/departments')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <p className="text-center text-gray-600 py-8">
          Phòng ban không tồn tại hoặc đã bị xóa.
        </p>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý phòng ban"
      description="Quản lý thông tin các phòng ban trong hệ thống"
      formTitle={`Chỉnh sửa: ${department.name}`}
      breadcrumbItems={[
        { label: 'Quản lý phòng ban', href: '/departments' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/departments')}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          {/* Divider */}
          <ActionBarDivider />

          {/* Form Actions: Cancel, Save */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/departments')}
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
      {/* Form Component */}
      <DepartmentForm
        initialData={department}
        onSuccess={() => navigate(`/departments/${id}`)}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
