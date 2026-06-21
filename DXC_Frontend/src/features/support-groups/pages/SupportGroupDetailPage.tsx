import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DetailPageLayout, ActionBarDivider } from "@/shared/components"
import { ChevronLeft, Edit, Trash2, AlertCircle } from "lucide-react"
import { SupportGroupProfile } from "../components/SupportGroupProfile"
import { useSupportGroupDetail, useDeleteSupportGroup } from "../hooks/useSupportGroups"

export const SupportGroupDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = useSupportGroupDetail(id || "")
  const deleteMutation = useDeleteSupportGroup()

  // ====== EVENT HANDLERS ======
  const handleNavigateBack = () => {
    navigate("/support-groups")
  }

  const handleEdit = () => {
    if (id) {
      navigate(`/support-groups/${id}/edit`)
    }
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(
        { publicId: id },
        {
          onSuccess: () => {
            navigate("/support-groups")
          },
        },
      )
    }
  }

  // ====== ERROR STATE ======
  if (error || !data) {
    return (
      <DetailPageLayout
        title="Quản lý nhóm hỗ trợ"
        description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: "Quản lý nhóm hỗ trợ", href: "/support-groups" },
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateBack}
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
            <Button variant="outline" onClick={handleNavigateBack}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const supportGroup = data

  return (
    <>
      <DetailPageLayout
        title="Quản lý nhóm hỗ trợ"
        description="Quản lý danh sách nhóm hỗ trợ trong hệ thống"
        objectName={supportGroup.groupName || "Chi tiết nhóm hỗ trợ"}
        breadcrumbItems={[
          { label: "Quản lý nhóm hỗ trợ", href: "/support-groups" },
          { label: supportGroup.groupName || "Chi tiết", current: true },
        ]}
        actionBarContent={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateBack}
              disabled={isLoading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              disabled={isLoading}
              className="gap-2"
            >
              <Edit className="w-4 h-4 text-blue-600" />
              Chỉnh sửa
            </Button>

            <ActionBarDivider />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Xóa
            </Button>
          </>
        }
      >
        <SupportGroupProfile supportGroup={supportGroup} />

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa nhóm hỗ trợ?</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác. Nhóm hỗ trợ sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DetailPageLayout>
    </>
  )
}
