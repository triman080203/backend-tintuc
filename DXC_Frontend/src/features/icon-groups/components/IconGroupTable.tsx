import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import { Badge } from '@/components/ui/badge'
import type { IconGroupTableRow } from '../types'

interface IconGroupTableProps {
  items: IconGroupTableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  onDelete?: (id: string) => void
}

export const IconGroupTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: IconGroupTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: IconGroupTableRow) => {
    navigate(`/icon-groups/${row.publicId}`)
  }

  const columns: Column<IconGroupTableRow>[] = [
    {
      key: 'name',
      label: 'Tên nhóm',
      width: '200px',
      sortable: true,
    },
    {
      key: 'iconCategoryName',
      label: 'Danh mục',
      width: '180px',
      render: (value) => value || '-',
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '250px',
      render: (value) => (value ? value.substring(0, 80) + (value.length > 80 ? '...' : '') : '-'),
    },
    {
      key: 'displayOrder',
      label: 'Thứ tự',
      width: '80px',
      render: (value) => value ?? '-',
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '100px',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Hoạt động' : 'Vô hiệu'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '130px',
      render: (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '-'),
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: IconGroupTableRow) => {
        navigate(`/icon-groups/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: IconGroupTableRow) => {
        navigate(`/icon-groups/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: IconGroupTableRow) => {
        onDelete?.(row.publicId)
      },
    },
  ]

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
        description: 'Hãy tạo nhóm icon đầu tiên của bạn',
      }}
    />
  )
}
