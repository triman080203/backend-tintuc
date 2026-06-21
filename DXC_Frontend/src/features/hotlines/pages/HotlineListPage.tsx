import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import HotlineTable from '../components/HotlineTable'
import { useHotlines, useDeleteHotline } from '../hooks/useHotlines'

export const HotlineListPage = () => {
  const navigate = useNavigate()

  // Pagination
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // Data fetching
  const { data, isLoading } = useHotlines({
    ...getPaginationParams(),
    ContactName: searchTerm || undefined,
  })

  const deleteQuery = useDeleteHotline()

  // Event handlers
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1)
    setIsSearchOpen(false)
  }

  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setIsSearchOpen(false)
  }

  const handleOpenSearch = (open: boolean) => {
    if (open) {
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      deleteQuery.mutate(id)
    }
  }

  return (
    <>
      <ListPageLayout
        title="Quản lý Hotline"
        description="Quản lý tất cả hotline trong hệ thống"
        breadcrumbItems={[
          { label: 'Quản lý Hotline', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotlines/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm mới
            </Button>

            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenSearch(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <HotlineTable
          items={((data?.data || []) as any[]).sort((a, b) => {
            const aOrder = a?.thuTu ?? 0
            const bOrder = b?.thuTu ?? 0
            if (aOrder !== bOrder) return aOrder - bOrder
            return String(a?.contactName || '').localeCompare(String(b?.contactName || ''))
          })}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize: pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          onDelete={handleDelete}
        />
      </ListPageLayout>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm Hotline</DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Nhập từ khóa tìm kiếm..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelSearch}
            >
              Hủy
            </Button>
            <Button onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HotlineListPage
