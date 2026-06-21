import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { FeedbackTable } from '../components'
import { useFeedbackList } from '../hooks'

const FeedbackListPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // Auto-refetch data when route changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['feedback-list'] })
    queryClient.invalidateQueries({ queryKey: ['feedback-processing'] })
  }, [location.pathname, queryClient])

  const { data, isLoading } = useFeedbackList({
    ...getPaginationParams(),
    fullName: searchTerm || undefined,
    title: searchTerm || undefined,
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
        title="Điều phối phản ánh"
        description="Điều phối các phản ánh đã gửi từ người dân và doanh nghiệp"
        breadcrumbItems={[
          { label: 'Điều phối phản ánh', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/feedback/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Tạo phản ánh
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
        <FeedbackTable
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
      </ListPageLayout>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm phản ánh</DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Tìm kiếm theo tiêu đề hoặc tên người gửi..."
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

export default FeedbackListPage
