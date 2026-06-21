import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User, Phone, MapPin, Calendar, Building2, Eye, EyeOff } from 'lucide-react'
import FeedbackStatusBadge from './FeedbackStatusBadge'
import FeedbackAttachments from './FeedbackAttachments'
import type { FeedbackDetailDto } from '@/api/models'

interface FeedbackDetailCardProps {
  feedback: FeedbackDetailDto
}

const FeedbackDetailCard = ({ feedback }: FeedbackDetailCardProps) => {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-xl">{feedback.title}</CardTitle>
            <div className="flex items-center gap-2">
              <FeedbackStatusBadge
                statusCode={feedback.currentStatusCode}
                statusName={feedback.currentStatusName}
                statusColor={feedback.currentStatusColor}
              />
              {feedback.isPublic ? (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Eye className="h-3 w-3" />
                  <span>Công khai</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <EyeOff className="h-3 w-3" />
                  <span>Nội bộ</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold mb-2">Nội dung phản ánh</h4>
          <p className="text-sm whitespace-pre-wrap">{feedback.content}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Người gửi:</span>
              <span>{feedback.fullName}</span>
            </div>

            {feedback.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Số điện thoại:</span>
                <span>{feedback.phoneNumber}</span>
              </div>
            )}

            {feedback.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Địa điểm:</span>
                <span>{feedback.location}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {feedback.assignedDepartmentName && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phòng ban xử lý:</span>
                <span>{feedback.assignedDepartmentName}</span>
              </div>
            )}

            {feedback.assignedDepartmentContactEmail && (
              <div className="text-sm">
                <span className="font-medium">Email liên hệ:</span>
                <span className="ml-2 text-muted-foreground">
                  {feedback.assignedDepartmentContactEmail}
                </span>
              </div>
            )}

            {feedback.assignedDepartmentContactPhone && (
              <div className="text-sm">
                <span className="font-medium">SĐT liên hệ:</span>
                <span className="ml-2 text-muted-foreground">
                  {feedback.assignedDepartmentContactPhone}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Ngày tạo:</span>
              <span className="text-muted-foreground">{formatDate(feedback.createdAt)}</span>
            </div>

            {feedback.updatedAt && feedback.updatedAt !== feedback.createdAt && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cập nhật:</span>
                <span className="text-muted-foreground">{formatDate(feedback.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {feedback.attachments && feedback.attachments.length > 0 && (
          <>
            <Separator />
            <FeedbackAttachments attachments={feedback.attachments} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default FeedbackDetailCard
