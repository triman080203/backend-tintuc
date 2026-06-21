import { useNavigate } from 'react-router-dom'
import type { Column } from '@/shared/components'
import { DataTable } from '@/shared/components'

export type KhaoSatTableRow = {
  id: number
  tenKhaoSat: string
  thoiGian: string
  isActive: boolean
  createdAt: string
}

type Props = {
  items: KhaoSatTableRow[]
  isLoading: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

export const KhaoSatTable = ({ items, isLoading, pagination }: Props) => {
  const navigate = useNavigate()
  const columns: Column<KhaoSatTableRow>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
    },
    {
      key: 'tenKhaoSat',
      label: 'Tên khảo sát',
      width: '240px',
    },
    {
      key: 'thoiGian',
      label: 'Thời gian',
      width: '180px',
      render: (value: string) => {
        const d = value ? new Date(value) : null
        return d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
      },
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '140px',
      render: (value: boolean) => (
        <span className={value ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '180px',
      render: (value: string) => {
        const d = value ? new Date(value) : null
        return d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
      },
    },
  ]

  const handleRowClick = (row: KhaoSatTableRow) => {
    navigate(`/khaosat/${row.id}`)
  }

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      pagination={pagination}
      rowKey="id"
      onRowClick={handleRowClick}
      emptyState={{
        title: 'Không có dữ liệu',
        description: 'Hãy tạo khảo sát đầu tiên của bạn',
      }}
    />
  )
}
