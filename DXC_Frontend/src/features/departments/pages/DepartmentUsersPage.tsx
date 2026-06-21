import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Plus, Search, Loader2, Users, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '@/shared/components/EnhancedTable'
import { Breadcrumb } from '@/shared/components/Breadcrumb'
import { useDepartmentUsers, useRemoveUserFromDepartment } from '../hooks/useDepartments'
import { useDepartmentDetail } from '../hooks/useDepartmentDetail'
import AssignUserModal from '../components/AssignUserModal'
export const DepartmentUsersPage = () => {
  const { id: departmentPublicId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [params, setParams] = useState({
    Current: 1,
    PageSize: 10,
  })

  const { data: departmentDetail, isLoading: departmentLoading } = useDepartmentDetail(departmentPublicId!)
  const { data: usersData, isLoading: usersLoading } = useDepartmentUsers(departmentPublicId!, params)
  const removeUserMutation = useRemoveUserFromDepartment()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setParams(prev => ({
      ...prev,
      Current: 1,
    }))
  }

  const handleRemoveUser = (userPublicId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này khỏi phòng ban?')) {
      removeUserMutation.mutate({
        userPublicId,
        departmentPublicId: departmentPublicId!,
      })
    }
  }

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, Current: page }))
  }

  if (departmentLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/departments/${departmentPublicId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">Đang tải thông tin phòng ban...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const department = departmentDetail?.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(`/departments/${departmentPublicId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Button onClick={() => setAssignDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/dashboard' },
          { label: 'Quản lý phòng ban', href: '/departments' },
          { label: department?.name || 'Chi tiết phòng ban', href: `/departments/${departmentPublicId}` },
          { label: 'Quản lý người dùng', current: true },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng - {department?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách những người dùng thuộc phòng ban này
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="pl-9"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {usersLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">Đang tải danh sách người dùng...</p>
            </div>
          </CardContent>
        </Card>
      ) : !usersData?.data || usersData.data.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có người dùng</h3>
              <p className="text-muted-foreground mb-4">
                Phòng ban này chưa có người dùng nào. Hãy thêm người dùng mới.
              </p>
              <Button onClick={() => setAssignDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell className="w-[50px]">#</TableHeaderCell>
                <TableHeaderCell>Tên người dùng</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Trạng thái</TableHeaderCell>
                <TableHeaderCell>Ngày tạo</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {usersData.data.map((user, index) => (
                <TableRow key={user.userPublicId}>
                  <TableCell className="font-medium text-muted-foreground">
                    {(params.Current! - 1) * (params.PageSize! || 10) + index + 1}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.userName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {user.userName}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRemoveUser(user.userPublicId!)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa khỏi phòng ban
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {usersData && usersData.total !== undefined && usersData.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {((usersData.current || 1) - 1) * (usersData.pageSize || 10) + 1} -{' '}
            {Math.min((usersData.current || 1) * (usersData.pageSize || 10), usersData.total)} trong tổng số {usersData.total} người dùng
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(usersData.current || 1) === 1}
              onClick={() => handlePageChange((usersData.current || 1) - 1)}
            >
              Trước
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil((usersData.total || 0) / (usersData.pageSize || 10)) }, (_, i) => i + 1)
                .filter(
                  page =>
                    page === 1 ||
                    page === Math.ceil((usersData.total || 0) / (usersData.pageSize || 10)) ||
                    Math.abs(page - (usersData.current || 1)) <= 2
                )
                .map((page, idx, arr) => (
                  <div key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={page === (usersData.current || 1) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={(usersData.current || 1) >= Math.ceil((usersData.total || 0) / (usersData.pageSize || 10))}
              onClick={() => handlePageChange((usersData.current || 1) + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <AssignUserModal
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        departmentPublicId={departmentPublicId!}
        onSuccess={() => {
          setAssignDialogOpen(false)
        }}
      />
    </div>
  )
}
