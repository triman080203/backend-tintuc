import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/shared/components'
import { FileText } from 'lucide-react'
import { TinTucStatusBadge } from './TinTucStatusBadge'
import type { TinTucArticleDto } from '@/api/models'

interface TinTucTableProps {
  data: TinTucArticleDto[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  detailPath?: string
}

export const TinTucTable = ({
  data,
  isLoading = false,
  pagination,
  detailPath = '/tin-tuc',
}: TinTucTableProps) => {
  const navigate = useNavigate()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const columns: Column<TinTucArticleDto>[] = [
    {
      key: 'title',
      label: 'Tiêu đề',
      width: '300px',
      render: (value, row) => (
        <div>
          <div className="font-medium max-w-[300px] truncate" title={value}>{value}</div>
          {row.categoryName && (
            <div className="text-xs text-muted-foreground mt-1">
              Chuyên mục: {row.categoryName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'authorName',
      label: 'Tác giả',
      width: '150px',
      render: (value) => value || 'N/A',
    },
    {
      key: 'currentStatusCode',
      label: 'Trạng thái',
      width: '150px',
      render: (_, row) => (
        <TinTucStatusBadge
          statusCode={row.currentStatusCode}
          statusName={row.currentStatusName}
          statusColor={row.currentStatusColor}
        />
      ),
    },
    {
      key: 'viewCount',
      label: 'Lượt xem',
      width: '100px',
      render: (value) => <span className="font-medium">{value?.toLocaleString('vi-VN') || 0}</span>,
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => formatDate(value),
    },
    {
      key: 'publishedAt',
      label: 'Ngày xuất bản',
      width: '150px',
      render: (value) => (value ? formatDate(value) : '-'),
    },
  ]

  const handleRowClick = (row: TinTucArticleDto) => {
    navigate(`${detailPath}/${row.publicId}`)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      rowKey="publicId"
      onRowClick={handleRowClick}
      emptyState={{
        icon: <FileText className="h-12 w-12 text-muted-foreground" />,
        title: 'Không có bài viết',
        description: 'Chưa có tin bài nào trong danh sách này',
      }}
    />
  )
}
