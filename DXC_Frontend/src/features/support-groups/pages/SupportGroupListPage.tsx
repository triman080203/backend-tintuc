import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ListPageLayout, ActionBarDivider } from "@/shared/components"
import { usePagination } from "@/shared/hooks"
import { Plus, Search } from "lucide-react"
import { SupportGroupTable } from "../components/SupportGroupTable"
import { useSupportGroups, useDeleteSupportGroup } from "../hooks/useSupportGroups"
import type { SupportGroupTableRow } from "../types"

export const SupportGroupListPage = () => {
  const navigate = useNavigate()

  // ====== STATE MANAGEMENT ======
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(20)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

  // ====== DATA FETCHING ======
  const { data, isLoading } = useSupportGroups({
    ...getPaginationParams(),
    GroupName: searchTerm || undefined,
  })
  const deleteMutation = useDeleteSupportGroup()

  // ====== EVENT HANDLERS ======
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
    if (confirm("Bạn có chắc muốn xóa nhóm hỗ trợ này?")) {
      deleteMutation.mutate({ publicId: id })
    }
  }

  // ====== RENDER ======
  const items = (data?.data || []) as SupportGroupTableRow[]

  return (
    <>
      <ListPageLayout
        title="Quản lý nhóm hỗ trợ"
        description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
        breadcrumbItems={[
          { label: "Quản lý nhóm hỗ trợ", current: true },
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/support-groups/create")}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm nhóm
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
        <SupportGroupTable
          items={items}
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

      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm nhóm hỗ trợ</DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Nhập tên nhóm..."
            value={tempSearchTerm}
            onChange={(event) => setTempSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
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
