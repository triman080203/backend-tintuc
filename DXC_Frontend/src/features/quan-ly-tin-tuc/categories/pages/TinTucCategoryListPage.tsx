import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { TinTucCategoryTable } from '../components/TinTucCategoryTable'
import { useTinTucCategoryList } from '../hooks'

export const TinTucCategoryListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tin-tuc-category-list'] })
  }, [location.pathname, queryClient])

  const { data, isLoading } = useTinTucCategoryList({
    ...getPaginationParams(),
    keyword: searchTerm || undefined,
  })

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1)
    setIsSearchOpen(false)
  }

  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setIsSearchOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  return (
    <>
      <ListPageLayout
        title="Danh mục tin tức"
        description="Quản lý các chuyên mục hiển thị cho tin tức"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', href: '/tin-tuc' },
          { label: 'Danh mục', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tin-tuc/categories/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm danh mục
            </Button>
            <ActionBarDivider />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <div className="bg-card border rounded-lg">
          <TinTucCategoryTable
            data={data?.data || []}
            isLoading={isLoading}
            pagination={{
              current: page,
              total: data?.total || 0,
              pageSize: pageSize,
              onChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>
      </ListPageLayout>

      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm danh mục</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="keyword" className="text-sm font-medium">
                Tên danh mục
              </label>
              <Input
                id="keyword"
                placeholder="Nhập tên danh mục..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSearch}>
              Hủy
            </Button>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
