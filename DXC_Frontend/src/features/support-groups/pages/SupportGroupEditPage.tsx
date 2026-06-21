import { useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FormPageLayout, ActionBarDivider } from "@/shared/components"
import { ChevronLeft, X, Check, AlertCircle } from "lucide-react"
import { SupportGroupForm } from "../components/SupportGroupForm"
import { useSupportGroupDetail, useUpdateSupportGroup } from "../hooks/useSupportGroups"

export const SupportGroupEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateSupportGroup()
  const submitRef = useRef<(() => void) | null>(null)

  const { data: supportGroup, isLoading, error } = useSupportGroupDetail(id || "")

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  if (error || !supportGroup) {
    return (
      <FormPageLayout
        title="Quản lý nhóm hỗ trợ"
        description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
        formTitle="Không tìm thấy"
        breadcrumbItems={[
          { label: "Quản lý nhóm hỗ trợ", href: "/support-groups" },
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support-groups")}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy nhóm hỗ trợ
            </h3>
            <p className="text-gray-600 mb-6">
              Nhóm hỗ trợ bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button variant="outline" onClick={() => navigate("/support-groups")}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout
      title="Quản lý nhóm hỗ trợ"
      description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
      formTitle={`Chỉnh sửa: ${supportGroup.groupName || "Nhóm hỗ trợ"}`}
      breadcrumbItems={[
        { label: "Quản lý nhóm hỗ trợ", href: "/support-groups" },
        { label: "Chỉnh sửa", current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support-groups")}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support-groups")}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </>
      }
    >
      <SupportGroupForm
        initialData={supportGroup}
        onSuccess={() => navigate(supportGroup.publicId ? `/support-groups/${supportGroup.publicId}` : "/support-groups")}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default SupportGroupEditPage
