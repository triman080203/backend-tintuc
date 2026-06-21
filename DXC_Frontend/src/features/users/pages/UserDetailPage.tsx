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
import { ChevronLeft, Edit, Trash2, AlertCircle } from 'lucide-react'
import { UserProfile } from '../components/UserProfile'
import { useUserDetail } from '../hooks/useUserDetail'
import { useDeleteUser } from '../hooks/useUsers'

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: user, isLoading, error } = useUserDetail(id!)
  const deleteQuery = useDeleteUser()

  const handleEdit = () => {
    navigate(`/users/${id}/edit`)
  }

  const handleDelete = () => {
    deleteQuery.mutate(id!, {
      onSuccess: () => {
        navigate('/users')
      },
    })
  }

  if (error || !user) {
    return (
      <DetailPageLayout
        title="Quản lý người dùng"
        description="Quản lý tài khoản và quyền truy cập của người dùng"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý người dùng', href: '/users' }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/users')}
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
              Không tìm thấy người dùng
            </h3>
            <p className="text-gray-600 mb-6">
              Người dùng bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const item = user

  return (
    <>
      <DetailPageLayout
        title="Quản lý người dùng"
        description="Quản lý tài khoản và quyền truy cập của người dùng"
        objectName={item.fullName || 'Chi tiết người dùng'}
        breadcrumbItems={[
          { label: 'Quản lý người dùng', href: '/users' },
          { label: item.fullName || 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            {/* Navigation: Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/users')}
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
        <UserProfile user={item} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa người dùng?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 py-4">
              Hành động này không thể hoàn tác. Người dùng sẽ bị xóa vĩnh viễn.
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

export default UserDetailPage