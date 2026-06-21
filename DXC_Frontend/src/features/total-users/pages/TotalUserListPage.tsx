import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout } from '@/shared/components/ListPageLayout'
import { usePagination } from '@/shared/hooks/usePagination'
import { Search } from 'lucide-react'
import { TotalUserTable } from '../components/TotalUserTable'
import { useTotalUsers } from '../hooks/useTotalUsers'
import type { TotalUserTableRow } from '../types'

export const TotalUserListPage = () => {
  // const navigate = useNavigate()
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber)

  const { data, isLoading } = useTotalUsers({
    ...getPaginationParams(),
    Search: searchTerm || undefined,
    PhoneNumber: phoneNumber || undefined,
  })


  const handleOpenSearch = (open: boolean) => {
    if (open) {
      setTempSearchTerm(searchTerm)
      setTempPhoneNumber(phoneNumber)
    }
    setIsSearchOpen(open)
  }

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPhoneNumber(tempPhoneNumber)
    setIsSearchOpen(false)
    setPage(1)
  }

  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setTempPhoneNumber(phoneNumber)
    setIsSearchOpen(false)
  }


  const items = (data?.data || []) as TotalUserTableRow[]

  return (
    <>
      <ListPageLayout
        title="Thống kê người dùng"
        description="Danh sách người dùng tổng hợp từ Zalo Mini App"
        breadcrumbItems={[{ label: 'Quản trị hệ thống', href: '/dashboard' }, { label: 'Thống kê người dùng', current: true }]}
        actionBarContent={
          <>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/total-users/create')}
              disabled={isLoading}
              className="gap-2"
              aria-label="Thêm người dùng"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm
            </Button> */}
            {/* <ActionBarDivider /> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenSearch(true)}
              disabled={isLoading}
              className="gap-2"
              aria-label="Mở tìm kiếm"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <TotalUserTable
          items={items}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </ListPageLayout>

      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm người dùng</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-2">Tìm kiếm theo Username hoặc Số điện thoại</div>
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="Nhập một phần Username để tìm..."
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
            />
            <Input
              placeholder="Nhập số điện thoại để tìm..."
              value={tempPhoneNumber}
              onChange={(e) => setTempPhoneNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelSearch} aria-label="Hủy tìm kiếm">Hủy</Button>
            <Button onClick={handleSearch} aria-label="Thực hiện tìm kiếm">Tìm kiếm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
