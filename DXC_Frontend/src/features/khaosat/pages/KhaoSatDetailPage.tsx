import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, Trash2 } from 'lucide-react'
import { useKhaoSatDetail } from '../hooks/useKhaoSat'
import { useDeleteKhaoSat } from '../hooks/useKhaoSat'
import { QuestionManager } from '../components/QuestionManager'
import { EssayQuestionManager } from '../components/EssayQuestionManager'

export const KhaoSatDetailPage = () => {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { data, isLoading } = useKhaoSatDetail(id)
  const deleteMutation = useDeleteKhaoSat()

  if (isLoading) {
    return <div className="p-4">Đang tải...</div>
  }

  const src = data as any
  const item = src
    ? {
        id: src.id ?? src.Id ?? 0,
        tenKhaoSat: src.tenKhaoSat ?? src.TenKhaoSat ?? '',
        thoiGian: src.thoiGian ?? src.ThoiGian ?? '',
        isActive: src.isActive ?? src.IsActive ?? false,
        displayWebsite: src.displayWebsite ?? src.DisplayWebsite ?? '',
        header: src.header ?? src.Header ?? '',
        footer: src.footer ?? src.Footer ?? '',
        veViec: src.veViec ?? src.VeViec ?? '',
        questions: Array.isArray(src.questions)
          ? src.questions.map((q: any) => ({
              Id: q.id ?? q.Id ?? 0,
              NoiDung: q.noiDung ?? q.NoiDung ?? '',
              CauHoiTuLuan: q.cauHoiTuLuan ?? q.CauHoiTuLuan ?? null,
              STT: q.stt ?? q.STT ?? null,
              Answers: Array.isArray(q.answers)
                ? q.answers.map((a: any) => ({
                    Id: a.id ?? a.Id ?? 0,
                    TraLoi: a.traLoi ?? a.TraLoi ?? '',
                  }))
                : [],
            }))
          : [],
      }
    : null
  if (!item) {
    return <div className="p-4">Không tìm thấy khảo sát</div>
  }

  const handleEdit = () => {
    navigate(`/khaosat/${item.id}/edit`)
  }

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        navigate('/khaosat')
      },
    })
  }

  return (
    <DetailPageLayout
      title="Chi tiết khảo sát"
      objectName="Khảo sát"
      description="Thông tin chi tiết khảo sát"
      breadcrumbItems={[
        { label: 'Quản lý khảo sát', href: '/khaosat' },
        { label: `Khảo sát #${item.id}`, current: true },
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/khaosat')}
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
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            Xóa
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-medium">Tên khảo sát</div>
          <div>{item.tenKhaoSat || '-'}</div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Thời gian</div>
          <div>
            {(() => {
              const d = item.thoiGian ? new Date(item.thoiGian) : null
              return d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
            })()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Trạng thái</div>
          <div className={item.isActive ? 'text-green-600' : 'text-gray-500'}>
            {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Display Website</div>
          <div>{item.displayWebsite || '-'}</div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Header</div>
          <div className="whitespace-pre-line">{item.header || '-'}</div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Footer</div>
          <div className="whitespace-pre-line">{item.footer || '-'}</div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="font-medium">Về việc</div>
          <div className="whitespace-pre-line">{item.veViec || '-'}</div>
        </div>
      </div>
      <div className="mt-8">
        <QuestionManager surveyId={item.id} questions={item.questions || []} />
      </div>
      <div className="mt-8">
        <EssayQuestionManager surveyId={item.id} />
      </div>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa khảo sát?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Khảo sát sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DetailPageLayout>
  )
}
