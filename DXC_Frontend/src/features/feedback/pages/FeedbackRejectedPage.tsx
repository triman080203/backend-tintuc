import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Search } from 'lucide-react'
import { FeedbackTable } from '../components'
import { useFeedbackRejectedWithRole } from '../hooks'

const FeedbackRejectedPage = () => {
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // Auto-refetch data when route changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['feedback-rejected'] })
    queryClient.invalidateQueries({ queryKey: ['feedback-approval'] })
  }, [location.pathname, queryClient])

  const { data, isLoading } = useFeedbackRejectedWithRole({
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
        title="Phản ánh từ chối"
        description="Danh sách phản ánh đã bị từ chối"
        breadcrumbItems={[{ label: 'Phản ánh từ chối', current: true }]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenChange(true)}
            className="gap-2"
          >
            <Search className="w-4 h-4 text-blue-600" />
            Tìm kiếm
          </Button>
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
          detailPath="/feedback/rejected"
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

export default FeedbackRejectedPage
