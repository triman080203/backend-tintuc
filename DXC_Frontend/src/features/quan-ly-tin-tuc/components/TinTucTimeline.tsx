import { Clock, User, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ArticleProcessingHistoryDto } from '@/api/models'

interface TinTucTimelineProps {
  processings: ArticleProcessingHistoryDto[] | null | undefined
}

export const TinTucTimeline = ({ processings }: TinTucTimelineProps) => {
  if (!processings || processings.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">Chưa có lịch sử xử lý</p>
      </Card>
    )
  }

  // Sort processings by date (newest first)
  const sortedProcessings = [...processings].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return dateB - dateA
  })

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
    <Card className="p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold">Lịch sử xử lý</h4>
        {sortedProcessings.map((processing, index) => (
          <div key={processing.id || index}>
            <div className="flex gap-4">
              <div className="relative flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                {index < sortedProcessings.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {processing.fromStatusName || 'Khởi tạo'}
                      </p>
                      <span className="text-muted-foreground">→</span>
                      <p className="font-medium text-sm">
                        {processing.toStatusName || 'Không xác định'}
                      </p>
                    </div>

                    {processing.note && (
                      <p className="text-sm text-muted-foreground">{processing.note}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Người xử lý (ID: {processing.processorUserId || 'Hệ thống'})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(processing.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {index < sortedProcessings.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </Card>
  )
}
