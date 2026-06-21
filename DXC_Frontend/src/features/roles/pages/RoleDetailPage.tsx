import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, Trash2, AlertCircle } from 'lucide-react'
import { RoleProfile } from '../components/RoleProfile'
import { useRoleDetail } from '../hooks/useRoleDetail'
import { useDeleteRole } from '../hooks/useRoles'

export const RoleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = useRoleDetail(id!)
  const deleteQuery = useDeleteRole()

  // ====== EVENT HANDLERS ======
  const handleEdit = () => {
    navigate(`/roles/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/roles')
      },
    })
  }

  // ====== ERROR STATE ======
  if (error || !data?.data) {
    return (
      <DetailPageLayout
        title="Quản lý vai trò"
        description="Danh sách tất cả vai trò và quyền hạn"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý vai trò', href: '/roles' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/roles')}
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
              Không tìm thấy vai trò
            </h3>
            <p className="text-gray-600 mb-6">
              Vai trò bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/roles')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const item = data.data

  // ====== RENDER ======
  return (
    <DetailPageLayout
     title="Quản lý vai trò"
        description="Danh sách tất cả vai trò và quyền hạn"
      objectName={item.name || 'Chi tiết vai trò'}
      breadcrumbItems={[
        { label: 'Quản lý vai trò', href: '/roles' },
        { label: item.name || 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/roles')}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          {/* Divider between groups */}
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

          {/* Divider */}
          <ActionBarDivider />

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
      <RoleProfile role={item} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa vai trò?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Vai trò sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
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
  )
}

export default RoleDetailPage
