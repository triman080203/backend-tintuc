import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { DepartmentDto } from '@/api/models'

interface DepartmentTableProps {
  items: DepartmentDto[]
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

const DepartmentTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: DepartmentTableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<DepartmentDto>[] = [
    {
      key: 'name',
      label: 'Tên phòng ban',
      width: '200px',
      sortable: true,
    },
    {
      key: 'code',
      label: 'Mã phòng ban',
      width: '150px',
      render: (value) => <span className="font-mono text-sm">{value || '-'}</span>,
    },
    {
      key: 'organizationName',
      label: 'Đơn vị',
      width: '200px',
      render: (value) => value || '-',
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
      onClick: (row: DepartmentDto) => {
        navigate(`/departments/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: DepartmentDto) => {
        navigate(`/departments/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: DepartmentDto) => {
        onDelete?.(row.publicId!)
      },
    },
  ]

  // Handle row click to view details
  const handleRowClick = (row: DepartmentDto) => {
    navigate(`/departments/${row.publicId}`)
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
        description: 'Hãy tạo phòng ban đầu tiên của bạn',
      }}
    />
  )
}

export default DepartmentTable
