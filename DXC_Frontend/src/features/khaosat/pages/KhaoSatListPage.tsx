import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ListPageLayout, ActionBarDivider, DeleteConfirmDialog } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { KhaoSatTable, type KhaoSatTableRow } from '../components/KhaoSatTable'
import { useKhaoSatList } from '../hooks/useKhaoSat'

export const KhaoSatListPage = () => {
  const navigate = useNavigate()
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // danh sách khảo sát không hiển thị cột thao tác như banner

  const { data, isLoading } = useKhaoSatList({
    ...getPaginationParams(),
    TenKhaoSat: searchTerm || undefined,
  })

  // banner list không có hành động xóa/sửa trực tiếp, giữ lại state deleteId để tương thích nhưng không hiển thị nút

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1)
  }


  const confirmDelete = () => {}

  const items: KhaoSatTableRow[] = ((data?.data as any[]) || []).map((s: any) => ({
    id: s.id ?? s.Id ?? 0,
    tenKhaoSat: s.tenKhaoSat ?? s.TenKhaoSat ?? '',
    thoiGian: s.thoiGian ?? s.ThoiGian ?? '',
    isActive: s.isActive ?? s.IsActive ?? false,
    createdAt: s.createdAt ?? s.CreatedAt ?? '',
  }))

  return (
    <>
      <ListPageLayout
        title="Quản lý khảo sát"
        description="Quản lý danh sách khảo sát trong hệ thống"
        breadcrumbItems={[{ label: 'Quản lý khảo sát', current: true }]}
        actionBarContent={
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/khaosat/create')} className="gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm khảo sát
            </Button>
            <ActionBarDivider />
            <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <KhaoSatTable
          items={items}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </ListPageLayout
      >

      <DeleteConfirmDialog open={false} onCancel={() => {}} onConfirm={confirmDelete} title="Xóa khảo sát" description="Bạn có chắc muốn xóa khảo sát này?" />
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm khảo sát</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nhập tên khảo sát..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
                setIsSearchOpen(false)
              }
            }}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleSearch()
                setIsSearchOpen(false)
              }}
            >
              Tìm kiếm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
