import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Search, AlertCircle } from 'lucide-react'
import { FeedbackTable } from '../components'
import { useFeedbackApprovalByDepartment } from '../hooks'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'

const FeedbackApprovalPage = () => {
  const location = useLocation()
  const queryClient = useQueryClient()
  
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // Auto-refetch data when route changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['feedback-approval'] })
    queryClient.invalidateQueries({ queryKey: ['feedback-processing'] })
  }, [location.pathname, queryClient])

  const { data: currentUser, isLoading: userLoading } = useCurrentUser()
  const { data, isLoading: dataLoading } = useFeedbackApprovalByDepartment(
    {
      ...getPaginationParams(),
      fullName: searchTerm || undefined,
      title: searchTerm || undefined,
    },
    currentUser?.departmentPublicId
  )

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

  if (userLoading) {
    return (
      <ListPageLayout
        title="Phê duyệt phản ánh"
        description="Danh sách phản ánh đang chờ phê duyệt"
        breadcrumbItems={[{ label: 'Phê duyệt phản ánh', current: true }]}
        actionBarContent={<></>}
      >
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </ListPageLayout>
    )
  }

  if (!currentUser?.departmentPublicId) {
    return (
      <ListPageLayout
        title="Phê duyệt phản ánh"
        description="Danh sách phản ánh đang chờ phê duyệt"
        breadcrumbItems={[{ label: 'Phê duyệt phản ánh', current: true }]}
        actionBarContent={<></>}
      >
        <div className="flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg border border-dashed">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Chưa được gán phòng ban</h3>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Để xem danh sách phản ánh phê duyệt, hãy liên hệ quản trị viên để được gán vào một phòng ban.
          </p>
        </div>
      </ListPageLayout>
    )
  }

  return (
    <>
      <ListPageLayout
        title="Phê duyệt phản ánh"
        description="Danh sách phản ánh đang chờ phê duyệt"
        breadcrumbItems={[{ label: 'Phê duyệt phản ánh', current: true }]}
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
          isLoading={dataLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize: pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          detailPath="/feedback/approval"
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

export default FeedbackApprovalPage
