import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ActionBarDivider, ActionBar, Breadcrumb } from '@/shared/components'
import {
  ChevronLeft,
  Send,
  CheckCircle,
  XCircle,
  Globe,
  Archive,
  Edit,
  Eye,
  Calendar,
  User,
  Tag,
  Layers,
} from 'lucide-react'
import { TinTucStatusBadge, TinTucWorkflowDialog, TinTucTimeline, type WorkflowActionCode } from '../components'
import { useTinTucDetail } from '../hooks'
import { useAuth } from '@/shared/hooks/useAuth'

const TinTucDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<WorkflowActionCode>('submit')

  const { data, isLoading } = useTinTucDetail(id || '')
  const detail = data?.data

  const handleWorkflow = (action: WorkflowActionCode) => {
    setCurrentAction(action)
    setWorkflowDialogOpen(true)
  }

  // Workflow state flags
  const { user } = useAuth()
  const roles = user?.roleCodes || []
  
  // Quyền: admin/manager coi như full quyền.
  // Các roles nghiệp vụ: tong_bien_tap (Tổng biên tập), bien_tap_vien (Biên tập viên/editor), phong_vien (Phóng viên/reporter)
  const isSuperAccess = roles.includes('admin') || roles.includes('manager') || roles.includes('tong_bien_tap')
  const isBienTapVien = roles.includes('bien_tap_vien') || roles.includes('editor')
  const isPhongVien = roles.includes('phong_vien') || roles.includes('reporter')

  const isDraftOrReturned = detail?.currentStatusCode === 'draft' || detail?.currentStatusCode === 'returned'
  const isPending = detail?.currentStatusCode === 'pending_review'
  const isApproved = detail?.currentStatusCode === 'approved'
  const isPublished = detail?.currentStatusCode === 'published'

  // Phóng viên có thể tạo/sửa/gửi duyệt
  const canEdit = isDraftOrReturned && (isSuperAccess || isBienTapVien || isPhongVien)
  const canSubmit = isDraftOrReturned && (isSuperAccess || isBienTapVien || isPhongVien)
  
  // Biên tập viên có thể phê duyệt hoặc trả lại bài viết chờ duyệt
  const canApprove = isPending && (isSuperAccess || isBienTapVien)
  
  // Tổng biên tập có thể trả lại bài đang chờ duyệt hoặc đã duyệt
  const canReturn = (isPending && (isSuperAccess || isBienTapVien)) || (isApproved && isSuperAccess)
  
  // Xuất bản / Lưu trữ thường do Tổng biên tập hoặc Admin/Manager
  const canPublish = isApproved && isSuperAccess
  const canArchive = isPublished && isSuperAccess

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'Chưa có'
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ====== LOADING STATE ======
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-muted-foreground">Không tìm thấy bài viết</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/tin-tuc')}>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Quản lý tin tức', href: '/tin-tuc' },
            { label: detail.title || 'Chi tiết', current: true },
          ]}
        />

        {/* Action Bar */}
        <ActionBar>
          {/* Quay lại */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          {/* Trạng thái hiện tại */}
          <div className="flex items-center">
            <TinTucStatusBadge
              statusCode={detail.currentStatusCode ?? undefined}
              statusName={detail.currentStatusName ?? undefined}
              statusColor={detail.currentStatusColor ?? undefined}
            />
          </div>
          {(canApprove || canReturn || canPublish || canArchive) && (
            <ActionBarDivider />
          )}

          {/* Nút Phê duyệt (pending_review) */}
          {canApprove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWorkflow('approve')}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Phê duyệt
            </Button>
          )}

          {/* Nút Trả lại (pending_review / approved) */}
          {canReturn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWorkflow('return')}
              className="gap-2"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              Trả lại
            </Button>
          )}

          {/* Nút Xuất bản (approved) */}
          {canPublish && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWorkflow('publish')}
              className="gap-2"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              Xuất bản
            </Button>
          )}

          {/* Nút Lưu trữ (published) */}
          {canArchive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleWorkflow('archive')}
              className="gap-2"
            >
              <Archive className="w-4 h-4 text-gray-600" />
              Lưu trữ
            </Button>
          )}
        </ActionBar>

        {/* Main Content — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===== Left: Article Content ===== */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-5">
                {/* Thumbnail */}
                {detail.thumbnailUrl && (
                  <div className="w-full overflow-hidden rounded-lg border">
                    <img
                      src={detail.thumbnailUrl}
                      alt={detail.title ?? 'Ảnh bìa'}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold leading-tight">{detail.title}</h1>

                {/* Summary */}
                {detail.summary && (
                  <p className="text-base text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 italic">
                    {detail.summary}
                  </p>
                )}

                <Separator />

                {/* Content — render as HTML */}
                {detail.content ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: detail.content }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    Chưa có nội dung bài viết
                  </p>
                )}

                {/* Tags */}
                {detail.tags && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2 items-center">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {detail.tags.split(',').map((tag) => (
                        <span
                          key={tag.trim()}
                          className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ===== Right: Meta + Timeline ===== */}
          <div className="space-y-4">
            {/* Meta Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin bài viết
                </h3>

                <div className="space-y-3 text-sm">
                  {/* Category */}
                  {detail.categoryName && (
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Chuyên mục: </span>
                        <span className="font-medium">{detail.categoryName}</span>
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  {detail.authorName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Tác giả: </span>
                        <span className="font-medium">{detail.authorName}</span>
                      </div>
                    </div>
                  )}

                  {/* View count */}
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Lượt xem: </span>
                      <span className="font-medium">{(detail.viewCount ?? 0).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Created at */}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-muted-foreground">Ngày tạo: </span>
                      <span className="font-medium">{formatDate(detail.createdAt)}</span>
                    </div>
                  </div>

                  {/* Published at */}
                  {detail.publishedAt && (
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">Xuất bản lúc: </span>
                        <span className="font-medium">{formatDate(detail.publishedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Workflow buttons — repeated here for accessibility */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thao tác
                  </p>
                  <div className="flex flex-col gap-2">
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => navigate(`/tin-tuc/${id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa bài viết
                      </Button>
                    )}
                    {canSubmit && (
                      <Button
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => handleWorkflow('submit')}
                      >
                        <Send className="w-4 h-4" />
                        Gửi duyệt
                      </Button>
                    )}
                    {canApprove && (
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleWorkflow('approve')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Phê duyệt
                      </Button>
                    )}
                    {canReturn && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={() => handleWorkflow('return')}
                      >
                        <XCircle className="w-4 h-4" />
                        Trả lại
                      </Button>
                    )}
                    {canPublish && (
                      <Button
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => handleWorkflow('publish')}
                      >
                        <Globe className="w-4 h-4" />
                        Xuất bản
                      </Button>
                    )}
                    {canArchive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => handleWorkflow('archive')}
                      >
                        <Archive className="w-4 h-4" />
                        Lưu trữ
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Timeline */}
            <TinTucTimeline processings={detail.processingHistories} />
          </div>
        </div>
      </div>

      {/* Workflow Dialog */}
      <TinTucWorkflowDialog
        open={workflowDialogOpen}
        onOpenChange={setWorkflowDialogOpen}
        publicId={id}
        actionCode={currentAction}
      />
    </>
  )
}

export default TinTucDetailPage
