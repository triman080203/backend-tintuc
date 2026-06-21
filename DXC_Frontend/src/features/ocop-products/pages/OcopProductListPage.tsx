import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import { OcopProductTable } from '../components/OcopProductTable'
import { useOcopProducts, useDeleteOcopProduct } from '../hooks/useOcopProducts'
import { useOcopCategories } from '@/features/ocop-categories/hooks/useOcopCategories'
import { useOcopEnterprises } from '@/features/ocop-enterprises/hooks/useOcopEnterprises'

export const OcopProductListPage = () => {
  const navigate = useNavigate()

  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [enterpriseId, setEnterpriseId] = useState<string>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  const [tempCategoryId, setTempCategoryId] = useState(categoryId)
  const [tempEnterpriseId, setTempEnterpriseId] = useState(enterpriseId)
  const [tempMinPrice, setTempMinPrice] = useState(minPrice)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [deleteItemName, setDeleteItemName] = useState<string>('')

  const { data: productsData, isLoading } = useOcopProducts({
    ...getPaginationParams(),
    searchTerm: searchTerm || undefined,
    categoryPublicId: categoryId || undefined,
    enterprisePublicId: enterpriseId || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  })

  const { data: categoriesData } = useOcopCategories({ PageSize: 999 })
  const { data: enterprisesData } = useOcopEnterprises({ PageSize: 999 })

  const deleteQuery = useDeleteOcopProduct()

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setCategoryId(tempCategoryId)
    setEnterpriseId(tempEnterpriseId)
    setMinPrice(tempMinPrice)
    setMaxPrice(tempMaxPrice)
    setPage(1)
    setIsSearchOpen(false)
  }

  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setTempCategoryId(categoryId)
    setTempEnterpriseId(enterpriseId)
    setTempMinPrice(minPrice)
    setTempMaxPrice(maxPrice)
    setIsSearchOpen(false)
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteItemId(id)
    setDeleteItemName(name)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deleteItemId) {
      deleteQuery.mutate(deleteItemId, {
        onSuccess: () => {
          setDeleteConfirmOpen(false)
          setDeleteItemId(null)
          setDeleteItemName('')
        }
      })
    }
  }

  return (
    <>
      <ListPageLayout
        title="Quản lý sản phẩm OCOP"
        description="Danh sách các sản phẩm OCOP"
        breadcrumbItems={[
          { label: 'Quản lý sản phẩm OCOP', current: true }
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/ocop-products/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm sản phẩm
            </Button>

            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <OcopProductTable
          items={(productsData?.data || []).map(item => ({
            publicId: item.publicId || '',
            name: item.name || '',
            categoryName: item.category?.name,
            enterpriseName: item.enterprise?.name,
            referencePrice: item.referencePrice,
            promotionalPrice: item.promotionalPrice,
            createdAt: item.createdAt || '',
          }))}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: productsData?.total || 0,
            pageSize: pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          onDelete={handleDeleteClick}
        />
      </ListPageLayout>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tìm kiếm sản phẩm OCOP</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <Input
                placeholder="Nhập tên sản phẩm..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Danh mục</label>
              <Select value={tempCategoryId} onValueChange={setTempCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {(categoriesData?.data || []).map(cat => (
                    <SelectItem key={cat.publicId} value={cat.publicId || ''}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Doanh nghiệp</label>
              <Select value={tempEnterpriseId} onValueChange={setTempEnterpriseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn doanh nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả doanh nghiệp</SelectItem>
                  {(enterprisesData?.data || []).map(ent => (
                    <SelectItem key={ent.publicId} value={ent.publicId || ''}>
                      {ent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Giá từ</label>
                <Input
                  type="number"
                  placeholder="Từ"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Đến</label>
                <Input
                  type="number"
                  placeholder="Đến"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{deleteItemName}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteQuery.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteQuery.isPending}
            >
              {deleteQuery.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OcopProductListPage
