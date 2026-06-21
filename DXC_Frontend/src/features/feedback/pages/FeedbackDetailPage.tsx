import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Edit, Trash2, UserPlus, FileText, Loader2, XCircle, User, Phone, MapPin, Calendar, Eye, Image, File, FileText as FileTextIcon, CheckCircle, ArrowLeftRight } from 'lucide-react'
import { getResponseStatus } from '../types'
import {
  FeedbackTimeline,
  FeedbackAssignForm,
  FeedbackResponseForm,
  FeedbackRejectForm,
  FeedbackApprovalForm,
  FeedbackRejectApprovalForm,
} from '../components'
import {
  useFeedbackDetail,
  useDeleteFeedback,
  useAssignFeedback,
  useCreateFeedbackResponse,
  useProcessFeedback,
  useFileDownload,
} from '../hooks'
import { useApproveFeedbackResponse, useRejectFeedbackResponse } from '../hooks/useFeedbackApproval'
import type { ApproveFeedbackResponseDto, RejectFeedbackResponseDto } from '@/api/models'
import type { AssignFeedbackFormData, FeedbackResponseFormData, RejectFeedbackFormData } from '../schemas'
import { toast } from 'sonner'

const FeedbackDetailPage = () => {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [rejectApprovalDialogOpen, setRejectApprovalDialogOpen] = useState(false)

  // Helper function to determine the list page path based on current URL
  const getListPagePath = () => {
    const path = location.pathname
    
    if (path.includes('/feedback/approval/')) {
      return '/feedback/approval'
    } else if (path.includes('/feedback/processing/')) {
      return '/feedback/processing'
    } else if (path.includes('/feedback/rejected/')) {
      return '/feedback/rejected'
    } else if (path.includes('/feedback/public/')) {
      return '/feedback/public'
    } else {
      return '/feedback'
    }
  }

  // Helper function to get page title and description based on current URL
  const getPageInfo = () => {
    const path = location.pathname
    
    if (path.includes('/feedback/approval/')) {
      return {
        title: 'Phê duyệt phản ánh',
        description: 'Danh sách phản ánh đang chờ phê duyệt',
        breadcrumbLabel: 'Phê duyệt phản ánh'
      }
    } else if (path.includes('/feedback/processing/')) {
      return {
        title: 'Xử lý phản ánh',
        description: 'Danh sách phản ánh đang được xử lý',
        breadcrumbLabel: 'Xử lý phản ánh'
      }
    } else if (path.includes('/feedback/rejected/')) {
      return {
        title: 'Phản ánh từ chối',
        description: 'Danh sách phản ánh đã bị từ chối',
        breadcrumbLabel: 'Phản ánh từ chối'
      }
    } else if (path.includes('/feedback/public/')) {
      return {
        title: 'Phản ánh hoàn thành',
        description: 'Danh sách phản ánh đã hoàn thành và công khai',
        breadcrumbLabel: 'Phản ánh hoàn thành'
      }
    } else {
      return {
        title: 'Điều phối phản ánh',
        description: 'Điều phối các phản ánh đã gửi từ người dân và doanh nghiệp',
        breadcrumbLabel: 'Quản lý phản ánh'
      }
    }
  }

  // Helper function to navigate back to the previous list page using replace
  const navigateBackToList = () => {
    navigate(getListPagePath(), { replace: true })
  }

  const { data, isLoading } = useFeedbackDetail(publicId || '', !!publicId)
  const deleteMutation = useDeleteFeedback()
  const assignMutation = useAssignFeedback()
  const createResponseMutation = useCreateFeedbackResponse()
  const processMutation = useProcessFeedback()
  const approveResponseMutation = useApproveFeedbackResponse()
  const rejectResponseMutation = useRejectFeedbackResponse()
  const { downloadFile } = useFileDownload()

  // Helper function to get file icon based on file extension
  const getFileIcon = (fileName: string | null | undefined) => {
    if (!fileName) return <File className="h-5 w-5" />
    
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext || '')) {
      return <Image className="h-5 w-5 text-green-600" />
    }
    
    // Documents
    if (['pdf'].includes(ext || '')) {
      return <FileTextIcon className="h-5 w-5 text-red-600" />
    }
    
    // Office documents
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || '')) {
      return <FileTextIcon className="h-5 w-5 text-blue-600" />
    }
    
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <File className="h-5 w-5 text-orange-600" />
    }
    
    // Default
    return <File className="h-5 w-5 text-gray-600" />
  }

  const handleDelete = () => {
    if (!publicId) return
    if (window.confirm('Bạn có chắc chắn muốn xóa phản ánh này?')) {
      deleteMutation.mutate(publicId, {
        onSuccess: () => {
          navigateBackToList()
        }
      })
    }
  }

  const handleAssign = (formData: AssignFeedbackFormData) => {
    // Use form data directly since API now expects correct format
    const assignData = {
      ...formData,
    }
    
    assignMutation.mutate(assignData, {
      onSuccess: () => {
        setAssignDialogOpen(false)
        navigateBackToList()
      },
    })
  }

  const handleCreateResponse = (formData: FeedbackResponseFormData) => {
    if (!publicId) return
    createResponseMutation.mutate(
      {
        feedbackPublicId: publicId,
        data: formData,
      },
      {
        onSuccess: () => {
          setResponseDialogOpen(false)
          navigateBackToList()
        },
      }
    )
  }

  const handleReject = (formData: RejectFeedbackFormData) => {
    if (!publicId || !feedback) return
    
    // Convert form data to ProcessFeedbackDto format
    const processData = {
      feedbackPublicId: formData.feedbackPublicId,
      fromStatusId: feedback.currentStatusId || 1, // Default to 1 if not set
      toStatusId: parseInt(formData.toStatusId), // 5 - rejected status
      processingNote: formData.rejectionReason,
    }
    
    processMutation.mutate(processData, {
      onSuccess: () => {
        setRejectDialogOpen(false)
        navigateBackToList()
      },
    })
  }

  const handleApprove = (formData: { approvalNote?: string }) => {
    if (!feedback?.responses?.length) {
      toast.error('Không có phản hồi nào để duyệt')
      return
    }
    
    // Get the latest response to approve
    const latestResponse = feedback.responses[0]
    if (!latestResponse.id) {
      toast.error('Phản hồi không hợp lệ')
      return
    }
    
    const approveData: ApproveFeedbackResponseDto = {
      responseId: latestResponse.id,
      isApproved: true,
      approvalNote: formData.approvalNote,
    }
    
    approveResponseMutation.mutate({
      responseId: latestResponse.id,
      data: approveData,
    }, {
      onSuccess: () => {
        setApprovalDialogOpen(false)
        navigateBackToList()
      },
    })
  }

  const handleReturnToDispatch = () => {
    if (!publicId || !feedback) return
    if (!window.confirm('Xác nhận chuyển trả điều phối?')) return
    const processData = {
      feedbackPublicId: publicId,
      fromStatusId: feedback.currentStatusId || 2,
      toStatusId: 1,
      processingNote: 'Chuyển trả điều phối',
    }
    processMutation.mutate(processData, {
      onSuccess: () => {
        navigateBackToList()
      },
    })
  }

  const handleRejectApproval = (formData: { rejectionNote: string }) => {
    if (!feedback?.responses?.length) {
      toast.error('Không có phản hồi nào để từ chối')
      return
    }
    
    // Get the latest response to reject
    const latestResponse = feedback.responses[0]
    if (!latestResponse.id) {
      toast.error('Phản hồi không hợp lệ')
      return
    }
    
    const rejectData: RejectFeedbackResponseDto = {
      rejectionNote: formData.rejectionNote,
    }
    
    rejectResponseMutation.mutate({
      responseId: latestResponse.id,
      data: rejectData,
    }, {
      onSuccess: () => {
        setRejectApprovalDialogOpen(false)
        navigateBackToList()
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!data?.data) {
    const pageInfo = getPageInfo()
    return (
      <DetailPageLayout
        title={pageInfo.title}
        description={pageInfo.description}
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: pageInfo.breadcrumbLabel, href: getListPagePath() },
          { label: 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBackToList}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-8 space-y-4">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy phản ánh</h3>
            <p className="text-muted-foreground mb-4">
              Phản ánh bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const feedback = data.data
  const pageInfo = getPageInfo()
  
  // Status-based button visibility
  const isRejected = feedback.currentStatusCode === 'rejected' || 
                     feedback.currentStatusCode === 'REJECTED' ||
                     feedback.currentStatusId === 5 ||
                     feedback.currentStatusName?.toLowerCase().includes('từ chối')
  
  const isInProgress = feedback.currentStatusCode === 'in_progress' || 
                       feedback.currentStatusCode === 'IN_PROGRESS' ||
                       feedback.currentStatusId === 2 ||
                       feedback.currentStatusName?.toLowerCase().includes('đang xử lý')

  const isPendingApproval = feedback.currentStatusCode === 'PENDING_APPROVAL' || 
                             feedback.currentStatusCode === 'pending_approval' ||
                             feedback.currentStatusId === 3 ||
                             feedback.currentStatusName?.toLowerCase().includes('chờ duyệt')
  
  const isCompleted = feedback.currentStatusCode?.toLowerCase() === 'completed' ||
                      feedback.currentStatusId === 4
  
  const canAssign = !feedback.assignedDepartmentId
  const canCreateResponse =
    feedback.assignedDepartmentId && feedback.currentStatusCode !== 'PENDING_APPROVAL' && !isPendingApproval
  const canReject = feedback.currentStatusCode === 'submitted' || 
                   feedback.currentStatusCode === 'SUBMITTED' ||
                   feedback.currentStatusId === 1 // Assuming 1 is "đã gửi" status

  return (
    <>
      <DetailPageLayout
        title={pageInfo.title}
        description={pageInfo.description}
        objectName={feedback.title || 'Chi tiết phản ánh'}
        breadcrumbItems={[
          { label: pageInfo.breadcrumbLabel, href: getListPagePath() },
          { label: feedback.title || 'Chi tiết', current: true }
        ]}
        actionBarContent={
          <>
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateBackToList}
              disabled={isLoading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              Quay lại
            </Button>

            {/* Action Buttons Group */}
            {!isCompleted && (
              <>
                {/* First group: Workflow actions */}
                {(canAssign && !isRejected) || canCreateResponse || canReject || isPendingApproval ? (
                  <>
                    <ActionBarDivider />
                    
                    {canAssign && !isRejected && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => setAssignDialogOpen(true)}
                        className="gap-2"
                      >
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        Điều phối
                      </Button>
                    )}
                    {canCreateResponse && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => setResponseDialogOpen(true)}
                        className="gap-2"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        Tạo phản hồi
                      </Button>
                    )}
                    {isInProgress && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={handleReturnToDispatch}
                        className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        Chuyển trả điều phối
                      </Button>
                    )}
                    {canReject && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectDialogOpen(true)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </Button>
                    )}
                    {isPendingApproval && (
                      <>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setApprovalDialogOpen(true)}
                          className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Duyệt phản hồi
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setRejectApprovalDialogOpen(true)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối duyệt
                        </Button>
                      </>
                    )}
                  </>
                ) : null}

                {/* Second group: Edit/Delete actions */}
                {!isRejected && !isInProgress && !isPendingApproval ? (
                  <>
                    <ActionBarDivider />
                    
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/feedback/${publicId}/edit`)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  </>
                ) : null}
              </>
            )}
          </>
        }
      >

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList>
          <TabsTrigger value="feedback">Phản ánh</TabsTrigger>
          <TabsTrigger value="responses">
            Phản hồi {feedback.responses && feedback.responses.length > 0 ? `(${feedback.responses.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-6">
          {/* Phản ánh content - moved from FeedbackDetailCard */}
          <Card>
            <CardHeader>
              {/* Status and title on same line */}
              <div className="flex items-center gap-3 flex-wrap">
                <div 
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" 
                  style={{
                    backgroundColor: feedback.currentStatusColor ? `${feedback.currentStatusColor}20` : '#6b728020',
                    color: feedback.currentStatusColor || '#6b7280'
                  }}
                >
                  {feedback.currentStatusName || 'Không có trạng thái'}
                </div>
                <CardTitle className="text-lg">{feedback.title}</CardTitle>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{feedback.fullName}</span>
                </div>
                {feedback.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{feedback.phoneNumber}</span>
                  </div>
                )}
                {feedback.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{feedback.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
                {feedback.assignedDepartmentName && (
                  <div className="col-span-1 md:col-span-2 pt-2 border-t">
                    <h4 className="font-medium mb-2 text-foreground">Phòng ban xử lý</h4>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">{feedback.assignedDepartmentName}</span> 
                        {feedback.assignedDepartmentCode && <span className="text-muted-foreground"> ({feedback.assignedDepartmentCode})</span>}
                      </p>
                      {feedback.assignedDepartmentContactEmail && (
                        <p className="text-sm text-blue-600 hover:underline cursor-pointer" 
                           onClick={() => window.open(`mailto:${feedback.assignedDepartmentContactEmail}`)}>
                          {feedback.assignedDepartmentContactEmail}
                        </p>
                      )}
                      {feedback.assignedDepartmentContactPhone && (
                        <p className="text-sm text-blue-600 hover:underline cursor-pointer"
                           onClick={() => window.open(`tel:${feedback.assignedDepartmentContactPhone}`)}>
                          {feedback.assignedDepartmentContactPhone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Nội dung phản ánh</h4>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {feedback.content}
                </p>
              </div>

              {feedback.attachments && feedback.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tệp đính kèm</h4>
                  <div className="space-y-2">
                    {feedback.attachments.map((attachment, index) => (
                      <div key={attachment.id || index} className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                        <div className="flex-shrink-0">
                          {getFileIcon(attachment.fileName)}
                        </div>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm truncate">
                            {attachment.fileName || 'Không có tên'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
                        </span>
                        {attachment.filePublicId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(attachment.filePublicId!, attachment.fileName || 'file')}
                            className="flex-shrink-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          {!feedback.responses || feedback.responses.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <p className="text-center text-muted-foreground">Chưa có phản hồi nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedback.responses.map((response, index) => (
                <Card key={response.id || index}>
                  <CardHeader>
                    {/* Status and title on same line */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {(() => {
                        const status = getResponseStatus(response.isApproved ?? null)
                        return (
                          <div 
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" 
                            style={{
                              backgroundColor: `${status.color}20`,
                              color: status.color
                            }}
                          >
                            {status.text}
                          </div>
                        )
                      })()}
                      <CardTitle className="text-lg">Phản hồi từ {response.departmentName}</CardTitle>
                    </div>
                    {/* Department info below title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Phòng ban: {response.departmentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{response.createdAt ? new Date(response.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Response content */}
                    <div>
                      <h4 className="font-medium mb-2">Nội dung phản hồi</h4>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {response.responseContent || 'Không có nội dung'}
                      </p>
                    </div>

                    {/* Attachments section */}
                    {response.attachments && response.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Tệp đính kèm</h4>
                        <div className="space-y-2">
                          {response.attachments.map((attachment, attIndex) => (
                            <div key={attachment.id || attIndex} className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                              <div className="flex-shrink-0">
                                {getFileIcon(attachment.fileName)}
                              </div>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-sm truncate">
                                  {attachment.fileName || 'Không có tên'}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
                              </span>
                              {attachment.filePublicId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => downloadFile(attachment.filePublicId!, attachment.fileName || 'file')}
                                  className="flex-shrink-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </DetailPageLayout>

      {/* Lịch sử xử lý - outside DetailPageLayout */}
      <div className="mt-6">
        <FeedbackTimeline processings={feedback.processings} />
      </div>

      {/* Dialogs */}
      {publicId && (
        <>
          <FeedbackAssignForm
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            feedbackPublicId={publicId}
            onSubmit={handleAssign}
            isSubmitting={assignMutation.isPending}
          />
          <FeedbackResponseForm
            open={responseDialogOpen}
            onOpenChange={setResponseDialogOpen}
            onSubmit={handleCreateResponse}
            isSubmitting={createResponseMutation.isPending}
          />
          <FeedbackRejectForm
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            feedbackPublicId={publicId}
            onSubmit={handleReject}
            isSubmitting={processMutation.isPending}
          />
          <FeedbackApprovalForm
            open={approvalDialogOpen}
            onOpenChange={setApprovalDialogOpen}
            onSubmit={handleApprove}
            isSubmitting={approveResponseMutation.isPending}
          />
          <FeedbackRejectApprovalForm
            open={rejectApprovalDialogOpen}
            onOpenChange={setRejectApprovalDialogOpen}
            onSubmit={handleRejectApproval}
            isSubmitting={rejectResponseMutation.isPending}
          />
        </>
      )}
    </>
  )
}

export default FeedbackDetailPage
