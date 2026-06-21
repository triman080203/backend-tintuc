import { DataTable } from '@/shared/components'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import type { TinTucCategoryDto } from '@/api/models'
import type { Column } from '@/shared/components/DataTable'
import { useNavigate } from 'react-router-dom'

interface TinTucCategoryTableProps {
  data: TinTucCategoryDto[]
  isLoading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }
}

export const TinTucCategoryTable = ({ data, isLoading, pagination }: TinTucCategoryTableProps) => {
  const navigate = useNavigate()

  const columns: Column<TinTucCategoryDto>[] = [
    {
      key: 'name',
      label: 'Tên danh mục',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Mô tả',
      render: (_, row) => (
        <div className="max-w-[300px] truncate" title={row.description || ''}>
          {row.description || '-'}
        </div>
      ),
    },
    {
      key: 'displayOrder',
      label: 'Thứ tự',
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      render: (_, row) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'} className="gap-1">
          {row.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {row.isActive ? 'Hoạt động' : 'Tạm ẩn'}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      onRowClick={(row) => navigate(`/tin-tuc/categories/${row.publicId}`)}
    />
  )
}
