import { Mail, Phone } from 'lucide-react'
import type { DepartmentWithOrganizationDto } from '@/api/models'

interface DepartmentProfileProps {
  department: DepartmentWithOrganizationDto
}

export const DepartmentProfile = ({ department }: DepartmentProfileProps) => {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Name and Code Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên</h3>
          <p className="text-lg text-gray-900">{department.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã</h3>
          <p className="text-lg text-gray-900 font-mono">{department.code || '-'}</p>
        </div>
      </div>

      {/* Description Section */}
      {department.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{department.description}</p>
        </div>
      )}

      {/* Contact Information */}
      {(department.contactEmail || department.contactPhone) && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin liên hệ</h3>
          <div className="space-y-3">
            {department.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a 
                  href={`mailto:${department.contactEmail}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {department.contactEmail}
                </a>
              </div>
            )}
            {department.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <a 
                  href={`tel:${department.contactPhone}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {department.contactPhone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organization Section */}
      {department.organizationName && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Đơn vị</h3>
          <p className="text-gray-700">{department.organizationName}</p>
        </div>
      )}

      {/* Metadata Section */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Trạng thái</h3>
          <p className="text-gray-600">
            {department.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">{formatDate(department.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}
