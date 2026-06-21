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
import { NewsTable } from '../components/NewsTable'
import { useNews, useDeleteNews } from '../hooks/useNews'
import type { NewsTableRow } from '../types'

export const NewsListPage = () => {
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
  const { data, isLoading } = useNews({
    ...getPaginationParams(),
    Keyword: searchTerm || undefined,
    // IsActive: true, // You can choose to filter active only or show all for admin
  })
  
  const deleteQuery = useDeleteNews()

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
    if (confirm('Bạn có chắc muốn xóa tin tức này?')) {
      deleteQuery.mutate({ publicId })
    }
  }

  // ====== DATA TRANSFORMATION ======
  const newsTableData: NewsTableRow[] = (data?.data || []).map(news => ({
    publicId: news.publicId || '',
    title: news.title || '',
    slug: news.slug || null,
    authorName: news.authorName || null,
    viewCount: news.viewCount || 0,
    publishedAt: news.publishedAt || null,
    thuTu: news.thuTu || 0,
    isActive: news.isActive || false,
    createdAt: news.createdAt || '',
    coverImageUrl: news.coverImageUrl || null,
  }))

  // ====== RENDER ======
  return (
    <>
      {/* Main List Page */}
      <ListPageLayout
        title="Quản lý tin tức"
        description="Quản lý tất cả tin tức trong hệ thống"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', current: true }
        ]}
        actionBarContent={
          <>
            {/* Create Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/news/create')}
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
        <NewsTable
          items={[...newsTableData].sort((a, b) => {
            const aOrder = a?.thuTu ?? 0
            const bOrder = b?.thuTu ?? 0
            if (aOrder !== bOrder) return aOrder - bOrder
            return String(b?.createdAt || '').localeCompare(String(a?.createdAt || ''))
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
            <DialogTitle>Tìm kiếm tin tức</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-title">Tiêu đề</Label>
              <Input
                id="search-title"
                placeholder="Nhập tiêu đề tin tức..."
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

export default NewsListPage
