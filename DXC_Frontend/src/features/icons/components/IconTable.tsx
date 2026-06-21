import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { IconTableRow } from '../types'

interface IconTableProps {
  items: IconTableRow[]
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

export const IconTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: IconTableProps) => {
  const navigate = useNavigate()

  const handleRowClick = (row: IconTableRow) => {
    navigate(`/icons/${row.publicId}`)
  }

  const columns: Column<IconTableRow>[] = [
    {
      key: 'name',
      label: 'Tên icon',
      width: '180px',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '250px',
      render: (value) => (value ? value.substring(0, 80) + (value.length > 80 ? '...' : '') : '-'),
    },
    {
      key: 'iconGroupName',
      label: 'Nhóm',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'iconCategoryName',
      label: 'Danh mục',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'linkAndroid',
      label: 'Android',
      width: '100px',
      render: (value) => (
        value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mở liên kết Android"
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-muted"
            title="Mở liên kết Android"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
        ) : '-'
      ),
    },
    {
      key: 'linkIOS',
      label: 'iOS',
      width: '100px',
      render: (value) => (
        value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mở liên kết iOS"
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-muted"
            title="Mở liên kết iOS"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
        ) : '-'
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
      onClick: (row: IconTableRow) => {
        navigate(`/icons/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: IconTableRow) => {
        navigate(`/icons/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: (row: IconTableRow) => {
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
        description: 'Hãy tạo icon đầu tiên của bạn',
      }}
    />
  )
}
