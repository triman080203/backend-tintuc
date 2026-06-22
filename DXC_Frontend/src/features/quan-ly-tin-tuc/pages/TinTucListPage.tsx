import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { TinTucTable } from '../components'
import { useTinTucList } from '../hooks'

const STATUS_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'returned', label: 'Bị trả lại' },
]

const TinTucListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  const [currentTab, setCurrentTab] = useState('all')

  // Auto-refetch data when route changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['tin-tuc-list'] })
  }, [location.pathname, queryClient])

  const { data, isLoading } = useTinTucList({
    ...getPaginationParams(),
    title: searchTerm || undefined,
    currentStatusCode: currentTab === 'all' ? undefined : currentTab,
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

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    setPage(1)
  }

  return (
    <>
      <ListPageLayout
        title="Quản lý tin tức"
        description="Quản lý tin bài, soạn thảo, duyệt và xuất bản tin tức trên ứng dụng Zalo Mini App"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tin-tuc/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Tạo tin bài
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
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {STATUS_TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="bg-card border rounded-lg">
            <TinTucTable
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
        </Tabs>
      </ListPageLayout>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm tin bài</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Tiêu đề
              </label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề tin bài..."
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

export default TinTucListPage
