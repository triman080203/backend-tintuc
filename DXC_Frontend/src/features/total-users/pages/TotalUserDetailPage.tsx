import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailPageLayout } from '@/shared/components/DetailPageLayout'
import { ActionBarDivider } from '@/shared/components/ActionBar'
import { ChevronLeft, Edit } from 'lucide-react'
import { useTotalUserDetail } from '../hooks/useTotalUsers'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const TotalUserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, error } = useTotalUserDetail(Number(id))

  const handleEdit = () => {
    navigate(`/total-users/${id}/edit`)
  }

  

  const item = data?.data

  if (error || !item) {
    return (
      <DetailPageLayout
        title="Thống kê người dùng"
        description="Không tìm thấy dữ liệu"
        objectName="Không tìm thấy"
        breadcrumbItems={[{ label: 'Thống kê người dùng', href: '/total-users' }]} 
        actionBarContent={
          <Button variant="ghost" size="sm" onClick={() => navigate('/total-users')} className="gap-2" aria-label="Quay lại">
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12">Không có dữ liệu</div>
      </DetailPageLayout>
    )
  }

  return (
    <DetailPageLayout
      title="Thống kê người dùng"
      description="Chi tiết người dùng"
      objectName={item.username}
      breadcrumbItems={[{ label: 'Thống kê người dùng', href: '/total-users' }]} 
      actionBarContent={
        <>
          <Button variant="ghost" size="sm" onClick={() => navigate('/total-users')} className="gap-2" aria-label="Quay lại">
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          <ActionBarDivider />
          <Button variant="ghost" size="sm" onClick={handleEdit} className="gap-2" aria-label="Sửa">
            <Edit className="w-4 h-4 text-blue-600" />
            Sửa
          </Button>
          {/* <Button variant="ghost" size="sm" onClick={handleDelete} className="gap-2" aria-label="Xóa">
            <Trash2 className="w-4 h-4 text-blue-600" />
            Xóa
          </Button> */}
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">UserID</div>
          <div className="font-medium">{item.userId}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Tên Zalo</div>
          <div className="font-medium">{item.username}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Số điện thoại</div>
          <div className="font-medium">{item.phoneNumber || '-'}</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Avatar</div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage  src={item.avatar || ''} alt={`Avatar ${item.username}`} />
              <AvatarFallback>{(item.username || '').slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            {/* <span className="text-sm text-muted-foreground break-all">{item.avatar || '-'}</span> */}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Phân quyền</div>
          <div className="font-medium">{(item.phanQuyen || '').toLowerCase() === 'true' ? 'Có' : 'Không'}</div>
        </div>
      </div>
    </DetailPageLayout>
  )
}
