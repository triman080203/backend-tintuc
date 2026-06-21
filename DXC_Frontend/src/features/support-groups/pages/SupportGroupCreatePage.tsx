import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FormPageLayout, ActionBarDivider } from "@/shared/components"
import { ChevronLeft, X, Check } from "lucide-react"
import { SupportGroupForm } from "../components/SupportGroupForm"
import { useCreateSupportGroup } from "../hooks/useSupportGroups"

export const SupportGroupCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreateSupportGroup()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Quản lý nhóm hỗ trợ"
      description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
      formTitle="Tạo nhóm hỗ trợ mới"
      breadcrumbItems={[
        { label: "Quản lý nhóm hỗ trợ", href: "/support-groups" },
        { label: "Tạo mới", current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/support-groups")}
            disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </>
      }
    >
      <SupportGroupForm
        onSuccess={() => navigate("/support-groups")}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default SupportGroupCreatePage
