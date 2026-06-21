import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'
import type { OcopEnterpriseTableRow } from '../types'

interface OcopEnterpriseTableProps {
  items: OcopEnterpriseTableRow[]
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

export const OcopEnterpriseTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: OcopEnterpriseTableProps) => {
  const navigate = useNavigate()

  const columns: Column<OcopEnterpriseTableRow>[] = [
    {
      key: 'name',
      label: 'Tên doanh nghiệp',
      width: '250px',
      sortable: true,
    },
    {
      key: 'taxCode',
      label: 'Mã số thuế',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'representative',
      label: 'Người đại diện',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'phoneNumber',
      label: 'Số điện thoại',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-',
    },
  ]

  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: OcopEnterpriseTableRow) => {
        if (row.publicId) navigate(`/ocop-enterprises/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: OcopEnterpriseTableRow) => {
        if (row.publicId) navigate(`/ocop-enterprises/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: OcopEnterpriseTableRow) => {
        if (row.publicId) onDelete?.(row.publicId)
      },
    },
  ]

  const handleRowClick = (row: OcopEnterpriseTableRow) => {
    if (row.publicId) {
      navigate(`/ocop-enterprises/${row.publicId}`)
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
        description: 'Hãy tạo doanh nghiệp đầu tiên của bạn',
      }}
    />
  )
}

export default OcopEnterpriseTable
