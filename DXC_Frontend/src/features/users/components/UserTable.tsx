import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2, KeyRound } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { UserTableRow } from '../types'

interface UserTableProps {
  items: UserTableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  onDelete?: (id: string) => void
  onResetPassword?: (id: string, newPassword: string) => void
}

export const UserTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
  onResetPassword,
}: UserTableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<UserTableRow>[] = [
    {
      key: 'fullName',
      label: 'Tên đầy đủ',
      width: '200px',
      sortable: true,
    },
    {
      key: 'userName',
      label: 'Tên đăng nhập',
      width: '150px',
      render: (value) => <span className="font-mono text-sm">{value || '-'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'roleCodes',
      label: 'Vai trò',
      width: '150px',
      render: (value) => {
        if (!value || value.length === 0) return '-'
        return value.slice(0, 2).join(', ') + (value.length > 2 ? `... (+${value.length - 2})` : '')
      },
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '130px',
      render: (value) => (
        <span className={value ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {value ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-',
    },
  ]

  // Define actions
  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: UserTableRow) => {
        if (row.publicId) navigate(`/users/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: UserTableRow) => {
        if (row.publicId) navigate(`/users/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: UserTableRow) => {
        if (row.publicId) onDelete?.(row.publicId)
      },
    },
    {
      label: 'Reset mật khẩu',
      icon: KeyRound,
      onClick: (row: UserTableRow) => {
        if (!row.publicId) return
        const newPw = window.prompt('Nhập mật khẩu mới cho người dùng:')
        if (!newPw) return
        if (newPw.length < 8) {
          alert('Mật khẩu phải có ít nhất 8 ký tự')
          return
        }
        onResetPassword?.(row.publicId, newPw)
      },
    },
  ]

  // Handle row click to view details
  const handleRowClick = (row: UserTableRow) => {
    if (row.publicId) {
      navigate(`/users/${row.publicId}`)
    }
  }

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      actions={actions}
      pagination={pagination}
      rowKey="publicId"
      onRowClick={handleRowClick}
      emptyState={{
        icon: null,
        title: 'Không có dữ liệu',
        description: 'Hãy tạo người dùng đầu tiên của bạn',
      }}
    />
  )
}

export default UserTable
