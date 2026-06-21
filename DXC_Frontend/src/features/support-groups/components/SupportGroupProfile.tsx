import type { SupportGroupDto } from "@/api/models"

interface SupportGroupProfileProps {
  supportGroup: SupportGroupDto | null | undefined
}

export const SupportGroupProfile = ({ supportGroup }: SupportGroupProfileProps) => {
  if (!supportGroup) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Tên nhóm</p>
            <p className="text-gray-900">{supportGroup.groupName || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Danh mục</p>
            <p className="text-gray-900">{supportGroup.categoryName || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Loại nhóm</p>
            <p className="text-gray-900">{supportGroup.groupType || "-"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Liên kết</p>
            {supportGroup.groupLink ? (
              <a
                href={supportGroup.groupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {supportGroup.groupLink}
              </a>
            ) : (
              <p className="text-gray-900">-</p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Trạng thái</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                supportGroup.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {supportGroup.isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>

          {supportGroup.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Ngày tạo</p>
              <p className="text-gray-900">
                {new Date(supportGroup.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}

          {supportGroup.updatedAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Cập nhật lần cuối</p>
              <p className="text-gray-900">
                {new Date(supportGroup.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}

          {supportGroup.description && (
            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mô tả</p>
              <p className="text-gray-900 whitespace-pre-wrap">{supportGroup.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
