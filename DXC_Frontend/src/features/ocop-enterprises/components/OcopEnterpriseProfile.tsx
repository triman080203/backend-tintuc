import type { OcopEnterpriseDto } from '@/api/models'

interface OcopEnterpriseProfileProps {
  enterprise: OcopEnterpriseDto | null | undefined
}

export const OcopEnterpriseProfile = ({ enterprise }: OcopEnterpriseProfileProps) => {
  if (!enterprise) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên doanh nghiệp</h3>
          <p className="text-lg text-gray-900">{enterprise.name || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã số thuế</h3>
          <p className="text-lg text-gray-900 font-mono">{enterprise.taxCode || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Người đại diện</h3>
          <p className="text-gray-700">{enterprise.representative || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Số điện thoại</h3>
          <p className="text-gray-700">{enterprise.phoneNumber || '-'}</p>
        </div>
      </div>

      {enterprise.address && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Địa chỉ</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{enterprise.address}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Năm thành lập</h3>
          <p className="text-gray-700">{enterprise.establishedYear || '-'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Số chứng chỉ OCOP</h3>
          <p className="text-gray-700">{enterprise.ocopCertificateNumber || '-'}</p>
        </div>
      </div>

      {enterprise.latitude !== undefined && enterprise.longitude !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Vĩ độ</h3>
            <p className="text-gray-700 font-mono">{enterprise.latitude ?? '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Kinh độ</h3>
            <p className="text-gray-700 font-mono">{enterprise.longitude ?? '-'}</p>
          </div>
        </div>
      )}

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Trạng thái</h3>
          <p className="text-gray-600">
            {enterprise.isActive ? (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                Hoạt động
              </span>
            ) : (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                Không hoạt động
              </span>
            )}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">
            {enterprise.createdAt ? new Date(enterprise.createdAt).toLocaleDateString('vi-VN') : '-'}
          </p>
        </div>

       
      </div>
    </div>
  )
}

export default OcopEnterpriseProfile
