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
import { Label } from '@/components/ui/label'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { HomestayTable } from '../components/HomestayTable'
import { useHomestays, useDeleteHomestay } from '../hooks/useHomestays'
import type { HomestayTableRow } from '../types'

export const HomestayListPage = () => {
  const navigate = useNavigate()

  // ====== STATE MANAGEMENT ======
  
  // Pagination
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = 
    usePagination(10)
  
  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  
  // ====== DATA FETCHING ======
  const { data, isLoading } = useHomestays({
    ...getPaginationParams(),
    Name: searchTerm || undefined,
    IsActive: true, // Chỉ lấy homestay còn hoạt động
  })
  
  const deleteQuery = useDeleteHomestay()

  // ====== EVENT HANDLERS ======

  // Apply search
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1) // Reset to page 1 when searching
    setIsSearchOpen(false)
  }

  // Cancel search
  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setIsSearchOpen(false)
  }

  // Toggle search dialog
  const handleOpenSearch = (open: boolean) => {
    if (open) {
      // When opening, set temp to current value
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  // Delete item
  const handleDelete = (publicId: string) => {
    if (confirm('Bạn có chắc muốn xóa homestay này?')) {
      deleteQuery.mutate({ publicId })
    }
  }

  // ====== DATA TRANSFORMATION ======
  const homestayTableData: HomestayTableRow[] = (data?.data || []).map(homestay => ({
    publicId: homestay.publicId || '',
    name: homestay.name,
    address: homestay.address || null,
    phoneNumber: homestay.phoneNumber || null,
    website: homestay.website || null,
    linkVitri: homestay.linkVitri || null,
    averagePrice: homestay.averagePrice || null,
    averagePriceCurrency: homestay.averagePriceCurrency || null,
    createdAt: homestay.createdAt || '',
    imageCount: homestay.images?.length || 0,
    thuTu: (homestay as any)?.thuTu ?? undefined,
  }))

  // ====== RENDER ======
  return (
    <>
      {/* Main List Page */}
      <ListPageLayout
        title="Quản lý homestay"
        description="Quản lý tất cả homestay trong hệ thống"
        breadcrumbItems={[
          { label: 'Quản lý homestay', current: true }
        ]}
        actionBarContent={
          <>
            {/* Create Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/homestays/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm mới
            </Button>

            {/* Divider between button groups */}
            <ActionBarDivider />

            {/* Search Button */}
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
        {/* Table Component */}
        <HomestayTable
          items={[...homestayTableData].sort((a, b) => {
            const aOrder = a?.thuTu ?? 0
            const bOrder = b?.thuTu ?? 0
            if (aOrder !== bOrder) return aOrder - bOrder
            return String(a?.name || '').localeCompare(String(b?.name || ''))
          })}
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

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm homestay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Tên homestay</Label>
              <Input
                id="search-name"
                placeholder="Nhập tên homestay..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelSearch}>
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

export default HomestayListPage
