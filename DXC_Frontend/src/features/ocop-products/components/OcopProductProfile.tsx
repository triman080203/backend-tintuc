import type { OcopProductDto } from '@/api/models'
import { Badge } from '@/components/ui/badge'
import { ImageGallery } from './ImageGallery'

interface OcopProductProfileProps {
  product: OcopProductDto | null | undefined
}

export const OcopProductProfile = ({ product }: OcopProductProfileProps) => {
  if (!product) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên sản phẩm</h3>
          <p className="text-lg text-gray-900">{product.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</h3>
          <Badge variant={product.isActive ? 'default' : 'secondary'}>
            {product.isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{product.description || '-'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Danh mục</h3>
          <p className="text-gray-700">{product.category?.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Doanh nghiệp</h3>
          <p className="text-gray-700">{product.enterprise?.name || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Giá gốc</h3>
          <p className="text-gray-700 font-mono">
            {product.referencePrice ? `${product.referencePrice.toLocaleString('vi-VN')} ₫` : '-'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Giá khuyến mãi</h3>
          <p className="text-gray-700 font-mono">
            {product.promotionalPrice ? `${product.promotionalPrice.toLocaleString('vi-VN')} ₫` : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Số điện thoại liên hệ</h3>
          <p className="text-gray-700">{product.contactPhone || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Địa chỉ liên hệ</h3>
          <p className="text-gray-700">{product.contactAddress || '-'}</p>
        </div>
      </div>

      {product.latitude !== undefined && product.longitude !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Vĩ độ</h3>
            <p className="text-gray-700 font-mono">{product.latitude?.toFixed(6) || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Kinh độ</h3>
            <p className="text-gray-700 font-mono">{product.longitude?.toFixed(6) || '-'}</p>
          </div>
        </div>
      )}

      {product.images && product.images.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Ảnh sản phẩm</h3>
          <ImageGallery images={product.images} />
        </div>
      )}

      <div className="text-sm text-gray-500 pt-4 border-t">
        <p>Tạo lúc: {product.createdAt ? new Date(product.createdAt).toLocaleString('vi-VN') : '-'}</p>
        {product.updatedAt && (
          <p>Cập nhật lúc: {new Date(product.updatedAt).toLocaleString('vi-VN')}</p>
        )}
      </div>
    </div>
  )
}
