import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, Trash2, AlertCircle, Users } from 'lucide-react'
import { DepartmentProfile } from '../components/DepartmentProfile'
import { useDepartmentDetail } from '../hooks/useDepartmentDetail'
import { useDeleteDepartment } from '../hooks/useDepartments'

export const DepartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: department, isLoading, error } = useDepartmentDetail(id!)
  const deleteQuery = useDeleteDepartment()

  const handleEdit = () => {
    navigate(`/departments/${id}/edit`)
  }

  const handleManageUsers = () => {
    navigate(`/departments/${id}/users`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/departments')
      },
    })
  }

  if (error || !department?.data) {
    return (
      <DetailPageLayout
        title="Quản lý phòng ban"
        description="Quản lý thông tin các phòng ban trong hệ thống"
        objectName="Không tìm thấy"
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
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy phòng ban
            </h3>
            <p className="text-gray-600 mb-6">
              Phòng ban bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/departments')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const item = department.data

  return (
    <>
      <DetailPageLayout
        title="Quản lý phòng ban"
        description="Quản lý thông tin các phòng ban trong hệ thống"
        objectName={item.name || 'Chi tiết phòng ban'}
        breadcrumbItems={[
          { label: 'Quản lý phòng ban', href: '/departments' },
          { label: item.name || 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            {/* Navigation: Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/departments')}
              disabled={isLoading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            {/* Divider between groups */}
            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleManageUsers}
              disabled={isLoading}
              className="gap-2"
            >
              <Users className="w-4 h-4 text-blue-600" />
              Quản lý người dùng
            </Button>

            <ActionBarDivider />

            {/* Action: Edit */}
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

            {/* Action: Delete */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteQuery.isPending}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Xóa
            </Button>
          </>
        }
      >
        {/* Detail Content */}
        <DepartmentProfile department={item} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa phòng ban?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 py-4">
              Hành động này không thể hoàn tác. Phòng ban sẽ bị xóa vĩnh viễn.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteQuery.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteQuery.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteQuery.isPending ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DetailPageLayout>
    </>
  )
}
