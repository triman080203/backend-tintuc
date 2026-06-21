import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { usePagination } from '@/shared/hooks'
import { useEssayQuestions, useCreateEssayQuestion, useUpdateEssayQuestion, useDeleteEssayQuestion } from '../hooks/useKhaoSat'

type Props = {
  surveyId: number
}

export const EssayQuestionManager = ({ surveyId }: Props) => {
  const { getPaginationParams } = usePagination(10)
  const { data, isLoading } = useEssayQuestions({ SurveyId: surveyId, ...getPaginationParams() })
  const createMutation = useCreateEssayQuestion(surveyId)
  const updateMutation = useUpdateEssayQuestion(surveyId)
  const deleteMutation = useDeleteEssayQuestion(surveyId)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialog, setEditDialog] = useState<{ open: boolean; id?: number | null; value?: string }>({ open: false, id: null, value: '' })
  const [newContent, setNewContent] = useState('')

  const handleOpenCreate = () => {
    setNewContent('')
    setCreateDialogOpen(true)
  }

  const handleCreate = () => {
    if (!newContent.trim()) return
    createMutation.mutate({ cauHoiTuLuan: newContent.trim() }, { onSuccess: () => setCreateDialogOpen(false) })
  }

  const handleOpenEdit = (id: number, value: string) => {
    setEditDialog({ open: true, id, value })
  }

  const handleUpdate = () => {
    if (!editDialog.id || !editDialog.value?.trim()) return
    updateMutation.mutate({ id: editDialog.id, cauHoiTuLuan: editDialog.value.trim() }, { onSuccess: () => setEditDialog({ open: false, id: null, value: '' }) })
  }

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Bạn có chắc muốn xoá dữ liệu này?')
    if (!confirmed) return
    deleteMutation.mutate(id)
  }

  const items = ((data as any)?.data ?? (data as any)?.Data ?? []) as Array<any>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Câu hỏi tự luận</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenCreate}
          className="gap-2"
          aria-label="Thêm câu hỏi tự luận"
        >
          <Plus className="w-4 h-4 text-blue-600" />
          Thêm câu hỏi
        </Button>
      </div>
      <Separator />
      {isLoading ? (
        <div className="text-gray-600">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">Chưa có câu hỏi tự luận</div>
      ) : (
        <div className="space-y-3">
          {items.map(it => {
            const id = it?.id
            const content = it?.cauHoiTuLuan ?? ''
            return (
            <div key={id} className="flex items-center justify-between border rounded-md p-3">
              <div className="text-gray-800">{content || '-'}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(id, content)}
                  className="gap-2"
                  aria-label="Sửa câu hỏi tự luận"
                >
                  <Pencil className="w-4 h-4 text-blue-600" />
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(id)}
                  className="gap-2"
                  aria-label="Xóa câu hỏi tự luận"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  Xóa
                </Button>
              </div>
            </div>
          )})}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi tự luận</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nội dung câu hỏi tự luận"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            aria-label="Nội dung câu hỏi tự luận"
            tabIndex={0}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, id: editDialog.id, value: editDialog.value })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa câu hỏi tự luận</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nội dung câu hỏi tự luận"
            value={editDialog.value || ''}
            onChange={e => setEditDialog({ open: true, id: editDialog.id, value: e.target.value })}
            aria-label="Nội dung câu hỏi tự luận"
            tabIndex={0}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditDialog({ open: false, id: null, value: '' })}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
