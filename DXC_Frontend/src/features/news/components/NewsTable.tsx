import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2, Calendar, Eye as EyeIcon } from 'lucide-react'
import { DataTable, type Column, type TableAction } from '@/shared/components'
import type { NewsTableRow } from '../types'

interface NewsTableProps {
  items: NewsTableRow[]
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

export const NewsTable = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: NewsTableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<NewsTableRow>[] = [
    {
      key: 'thuTu',
      label: 'Thứ tự',
      width: '100px',
      sortable: true,
      render: (value) => (typeof value === 'number' ? value : '-'),
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      width: '300px',
      sortable: true,
      render: (value) => <span className="font-medium line-clamp-2">{value || '-'}</span>,
    },
    {
      key: 'authorName',
      label: 'Tác giả',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'viewCount',
      label: 'Lượt xem',
      width: '100px',
      render: (value) => (
        <div className="flex items-center gap-1">
          <EyeIcon className="w-3 h-3 text-gray-500" />
          <span>{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '120px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Hiển thị' : 'Đã ẩn'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-500" />
          <span>{new Date(value).toLocaleDateString('vi-VN')}</span>
        </div>
      ),
    },
  ]

  // Define actions
  const actions: TableAction[] = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: NewsTableRow) => {
        navigate(`/news/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: NewsTableRow) => {
        navigate(`/news/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row: NewsTableRow) => {
        onDelete?.(row.publicId)
      },
    },
  ]

  // Handle row click to view details
  const handleRowClick = (row: NewsTableRow) => {
    navigate(`/news/${row.publicId}`)
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
        title: 'Không có tin tức nào',
        description: 'Hãy tạo tin tức đầu tiên của bạn',
      }}
    />
  )
}

export default NewsTable
