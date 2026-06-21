import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/shared/components'
import { MessageSquare } from 'lucide-react'
import FeedbackStatusBadge from './FeedbackStatusBadge'
import type { FeedbackAdminDto } from '@/api/models'

interface FeedbackTableProps {
  data: FeedbackAdminDto[]
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

const FeedbackTable = ({
  data,
  isLoading = false,
  pagination,
  detailPath = '/feedback',
}: FeedbackTableProps) => {
  const navigate = useNavigate()

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const columns: Column<FeedbackAdminDto>[] = [
    {
      key: 'title',
      label: 'Tiêu đề',
      width: '300px',
      render: (value, row) => (
        <div className="max-w-[300px] truncate">
          {value}
          {row.attachmentCount && row.attachmentCount > 0 ? (
            <span className="ml-2 text-xs text-muted-foreground">
              ({row.attachmentCount} file)
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'fullName',
      label: 'Người gửi',
      width: '200px',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          {row.phoneNumber && (
            <p className="text-xs text-muted-foreground">{row.phoneNumber}</p>
          )}
        </div>
      ),
    },
    {
      key: 'currentStatusCode',
      label: 'Trạng thái',
      width: '150px',
      render: (_, row) => (
        <FeedbackStatusBadge
          statusCode={row.currentStatusCode}
          statusName={row.currentStatusName}
          statusColor={row.currentStatusColor}
        />
      ),
    },
    {
      key: 'assignedDepartmentName',
      label: 'Phòng ban',
      width: '200px',
      render: (value, row) => {
        if (value) {
          return (
            <div className="group relative cursor-help">
              <span>{value}</span>
              {row.assignedDepartmentCode && (
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-popover border rounded-md shadow-lg p-2 z-50 whitespace-nowrap text-xs">
                  <p className="text-muted-foreground">Mã: {row.assignedDepartmentCode}</p>
                </div>
              )}
            </div>
          )
        }
        return <span className="text-muted-foreground text-sm">Chưa phân công</span>
      },
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => formatDate(value),
    },
  ]

  const handleRowClick = (row: FeedbackAdminDto) => {
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
        icon: <MessageSquare className="h-12 w-12 text-muted-foreground" />,
        title: 'Không có dữ liệu',
        description: 'Chưa có phản ánh nào trong danh sách này',
      }}
    />
  )
}

export default FeedbackTable
