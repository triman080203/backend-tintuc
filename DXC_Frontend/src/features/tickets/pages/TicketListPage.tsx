import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus } from 'lucide-react'
import { TicketTable } from '../components/TicketTable'
import { useTickets, useDeleteTicket } from '../hooks/useTickets'
import type { TicketTableRow } from '../types'

export const TicketListPage = () => {
  const navigate = useNavigate()
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  
  const { data, isLoading } = useTickets({
    ...getPaginationParams(),
  })
  
  const deleteQuery = useDeleteTicket()

  const handleDelete = (publicId: string) => {
    if (confirm('Bạn có chắc muốn xóa Vé này?')) {
      deleteQuery.mutate({ publicId })
    }
  }

  const tableData: TicketTableRow[] = (data?.data || []).map(item => ({
    publicId: item.publicId || '',
    name: item.name || '',
    price: item.price || 0,
    childPrice: item.childPrice || 0,
    isActive: item.isActive || false,
    createdAt: item.createdAt || '',
  }))

  return (
    <ListPageLayout
      title="Quản lý Vé"
      description="Quản lý tất cả Vé trong hệ thống"
      breadcrumbItems={[{ label: 'Quản lý Vé', current: true }]}
      actionBarContent={
        <Button variant="ghost" size="sm" onClick={() => navigate('/tickets/create')} className="gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          Thêm mới
        </Button>
      }
    >
      <TicketTable
        items={tableData}
        isLoading={isLoading}
        pagination={{
          current: page,
          total: data?.total || 0,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        onDelete={handleDelete}
      />
    </ListPageLayout>
  )
}
