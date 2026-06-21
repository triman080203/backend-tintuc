import { FileText, Download, Image as ImageIcon, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { FeedbackAttachmentDto, FeedbackResponseAttachmentDto } from '@/api/models'
import { useFileDownload } from '../hooks/useFileDownload'

interface FeedbackAttachmentsProps {
  attachments:
    | FeedbackAttachmentDto[]
    | FeedbackResponseAttachmentDto[]
    | null
    | undefined
  title?: string
}

const FeedbackAttachments = ({ attachments, title = 'Tệp đính kèm' }: FeedbackAttachmentsProps) => {
  const { downloadFile } = useFileDownload()

  if (!attachments || attachments.length === 0) {
    return null
  }

  const getFileIcon = (fileName: string | null | undefined) => {
    if (!fileName) return <File className="h-5 w-5" />

    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <ImageIcon className="h-5 w-5" />
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDownload = (publicId: string | undefined, fileName: string | null | undefined) => {
    if (!publicId || !fileName) return
    downloadFile(publicId, fileName)
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="grid gap-2">
        {attachments.map((attachment, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-muted-foreground flex-shrink-0">
                  {getFileIcon(attachment.fileName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.fileName || 'Không có tên'}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.fileSize)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(attachment.filePublicId, attachment.fileName)}
                disabled={!attachment.filePublicId}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FeedbackAttachments
