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
import { HotlineCategoryTable } from '../components/HotlineCategoryTable'
import { useHotlineCategories, useDeleteHotlineCategory } from '../hooks/useHotlineCategories'
import type { HotlineCategoryTableRow } from '../types'

export const HotlineCategoryListPage = () => {
  const navigate = useNavigate()

  // ====== STATE MANAGEMENT ======

  // Pagination
  const { page, pageSize, setPage, setPageSize, getPaginationParams } =
    usePagination(20)

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // ====== DATA FETCHING ======
  const { data, isLoading } = useHotlineCategories({
    ...getPaginationParams(),
    Name: searchTerm || undefined,
  })

  const deleteQuery = useDeleteHotlineCategory()

  // ====== EVENT HANDLERS ======

  // Apply search
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1)
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
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  // Delete item
  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa danh mục Hotline này?')) {
      deleteQuery.mutate({ publicId: id })
    }
  }

  // ====== RENDER ======
  const items = (data?.data || []) as HotlineCategoryTableRow[]
  const sortedItems = [...items].sort((a, b) => {
    const aOrder = (a as any).thuTu ?? 0
    const bOrder = (b as any).thuTu ?? 0
    if (aOrder !== bOrder) return aOrder - bOrder
    return (a.name || '').localeCompare(b.name || '')
  })

  return (
    <>
      {/* Main List Page */}
      <ListPageLayout
        title="Quản lý danh mục Hotline"
        description="Quản lý danh sách danh mục hotline trong hệ thống"
        breadcrumbItems={[
          { label: 'Quản lý danh mục Hotline', current: true }
        ]}
        actionBarContent={
          <>
            {/* Create Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotline-categories/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm danh mục
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
        <HotlineCategoryTable
          items={sortedItems}
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
            <DialogTitle>Tìm kiếm danh mục Hotline</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <Input
            autoFocus
            placeholder="Nhập tên danh mục..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
          />

          {/* Dialog Actions */}
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
