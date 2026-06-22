import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { TinTucTable } from '../components'
import { useTinTucList } from '../hooks'

const TinTucBiTraLaiPage = () => {
  const navigate = useNavigate()

  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  const { data, isLoading } = useTinTucList({
    ...getPaginationParams(),
    Keyword: searchTerm || undefined,
    CurrentStatusId: 3, // returned — Bị trả lại
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
    if (open) setTempSearchTerm(searchTerm)
    setIsSearchOpen(open)
  }

  return (
    <>
      <ListPageLayout
        title="Bị trả lại"
        description="Danh sách tin bài bị trả lại, cần chỉnh sửa và gửi duyệt lại"
        breadcrumbItems={[
          { label: 'Quản lý tin tức', href: '/tin-tuc' },
          { label: 'Bị trả lại', current: true },
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
        <TinTucTable
          data={data?.data || []}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          detailPath="/tin-tuc/detail"
        />
      </ListPageLayout>

      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm tin bài</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nhập tiêu đề tin bài..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelSearch}>Hủy</Button>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TinTucBiTraLaiPage
