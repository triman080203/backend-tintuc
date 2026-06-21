import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus } from 'lucide-react'
import { TourTable } from '../components/TourTable'
import { useTours, useDeleteTour } from '../hooks/useTours'
import type { TourTableRow } from '../types'

export const TourListPage = () => {
  const navigate = useNavigate()
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  
  const { data, isLoading } = useTours({
    ...getPaginationParams(),
  })
  
  const deleteQuery = useDeleteTour()

  const handleDelete = (publicId: string) => {
    if (confirm('Bạn có chắc muốn xóa tour này?')) {
      deleteQuery.mutate({ publicId })
    }
  }

  const tableData: TourTableRow[] = (data?.data || []).map(item => ({
    publicId: item.publicId || '',
    name: item.name || '',
    price: item.price || 0,
    durationDays: item.durationDays || 0,
    durationNights: item.durationNights || 0,
    departureLocation: item.departureLocation || null,
    maxParticipants: item.maxParticipants || 0,
    isActive: item.isActive || false,
    createdAt: item.createdAt || '',
  }))

  return (
    <ListPageLayout
      title="Quản lý Tour"
      description="Quản lý tất cả tour du lịch trong hệ thống"
      breadcrumbItems={[{ label: 'Quản lý tour', current: true }]}
      actionBarContent={
        <Button variant="ghost" size="sm" onClick={() => navigate('/tours/create')} className="gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          Thêm mới
        </Button>
      }
    >
      <TourTable
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
