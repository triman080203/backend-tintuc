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
import { OcopCategoryTable } from '../components/OcopCategoryTable'
import { useOcopCategories, useDeleteOcopCategory } from '../hooks/useOcopCategories'

export const OcopCategoryListPage = () => {
  const navigate = useNavigate()

  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  const { data, isLoading } = useOcopCategories({
    ...getPaginationParams(),
    searchTerm: searchTerm || undefined,
  })

  const deleteQuery = useDeleteOcopCategory()

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
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      deleteQuery.mutate(id)
    }
  }

  return (
    <>
      <ListPageLayout
        title="Quản lý danh mục OCOP"
        description="Danh sách các danh mục sản phẩm OCOP"
        breadcrumbItems={[
          { label: 'Quản lý danh mục OCOP', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/ocop-categories/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm danh mục
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
        <OcopCategoryTable
          items={(data?.data || []).map(item => ({
            publicId: item.publicId || '',
            name: item.name || '',
            description: item.description,
            imageUrl: item.imageUrl,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
            createdAt: item.createdAt || '',
          }))}
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

      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm danh mục OCOP</DialogTitle>
          </DialogHeader>

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

export default OcopCategoryListPage
