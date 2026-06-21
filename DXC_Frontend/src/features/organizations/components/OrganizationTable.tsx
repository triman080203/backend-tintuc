import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/shared/components'
import { Building2 } from 'lucide-react'
import type { OrganizationDto } from '@/api/models'

interface OrganizationTableProps {
  organizations: OrganizationDto[]
  isLoading?: boolean
  pagination?: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }
}

const OrganizationTable = ({
  organizations,
  isLoading = false,
  pagination,
}: OrganizationTableProps) => {
  const navigate = useNavigate()

  const columns: Column<OrganizationDto>[] = [
    {
      key: 'name',
      label: 'Tên đơn vị',
      render: (value) => value || '-',
    },
    {
      key: 'code',
      label: 'Mã đơn vị',
      render: (value) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString('vi-VN')
          : '-',
    },
  ]

  const handleRowClick = (row: OrganizationDto) => {
    navigate(`/organizations/${row.publicId}`)
  }

  return (
    <DataTable
      columns={columns}
      data={organizations}
      isLoading={isLoading}
      pagination={pagination}
      rowKey="publicId"
      onRowClick={handleRowClick}
      emptyState={{
        icon: <Building2 className="h-12 w-12 text-muted-foreground" />,
        title: 'Không có dữ liệu',
        description: 'Chưa có đơn vị nào trong hệ thống. Tạo đơn vị đầu tiên ngay!',
      }}
    />
  )
}

export default OrganizationTable
