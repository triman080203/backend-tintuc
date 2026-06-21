import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { QuestionDto, AnswerDto } from '@/api/models'
import { useInsertQuestion, useUpdateQuestion, useDeleteQuestion, useInsertAnswer, useUpdateAnswer, useDeleteAnswer } from '../hooks/useKhaoSat'
import { usePagination } from '@/shared/hooks'

type Props = {
  surveyId: number
  questions: QuestionDto[]
}

export const QuestionManager = ({ surveyId, questions }: Props) => {
  const insertQuestion = useInsertQuestion(surveyId)
  const updateQuestion = useUpdateQuestion(surveyId)
  const deleteQuestion = useDeleteQuestion(surveyId)
  const insertAnswer = useInsertAnswer(surveyId)
  const updateAnswer = useUpdateAnswer(surveyId)
  const deleteAnswer = useDeleteAnswer(surveyId)

  const { page: questionPage, pageSize: questionPageSize, setPage: setQuestionPage, setPageSize: setQuestionPageSize } = usePagination(10)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editQuestionDialog, setEditQuestionDialog] = useState<{ open: boolean; question?: QuestionDto | null }>({ open: false, question: null })
  const [newQuestionContent, setNewQuestionContent] = useState('')
  const [newQuestionOrder, setNewQuestionOrder] = useState<number | ''>('')
  const [newAnswerByQuestion, setNewAnswerByQuestion] = useState<Record<number, string>>({})
  const [editingAnswer, setEditingAnswer] = useState<{ id: number; value: string } | null>(null)
  const [answerPageByQuestion] = useState<Record<number, number>>({})
  const [answerPageSizeByQuestion] = useState<Record<number, number>>({})

  const handleOpenCreate = () => {
    setNewQuestionContent('')
    setNewQuestionOrder('')
    setCreateDialogOpen(true)
  }

  const handleCreateQuestion = () => {
    if (!newQuestionContent.trim()) return
    insertQuestion.mutate(
      { noiDung: newQuestionContent.trim(), stt: typeof newQuestionOrder === 'number' ? newQuestionOrder : null },
      { onSuccess: () => setCreateDialogOpen(false) }
    )
  }

  const handleOpenEditQuestion = (q: QuestionDto) => {
    setEditQuestionDialog({ open: true, question: q })
    setNewQuestionContent(q.noiDung || '')
    setNewQuestionOrder(typeof q.stt === 'number' ? q.stt : ''
    )
  }

  const handleUpdateQuestion = () => {
    if (!editQuestionDialog.question) return
    if (!newQuestionContent.trim()) return
    updateQuestion.mutate(
      { id: editQuestionDialog.question.id, noiDung: newQuestionContent.trim(), stt: typeof newQuestionOrder === 'number' ? newQuestionOrder : null },
      { onSuccess: () => setEditQuestionDialog({ open: false, question: null }) }
    )
  }

  const handleDeleteQuestion = (id: number) => {
    deleteQuestion.mutate(id)
  }

  const handleAddAnswer = (questionId: number) => {
    const value = (newAnswerByQuestion[questionId] || '').trim()
    if (!value) return
    insertAnswer.mutate({ questionId: questionId, traLoi: value }, {
      onSuccess: () => {
        setNewAnswerByQuestion(prev => ({ ...prev, [questionId]: '' }))
      }
    })
  }

  const handleStartEditAnswer = (answer: AnswerDto) => {
    setEditingAnswer({ id: answer.id!, value: answer.traLoi! })
  }

  const handleUpdateAnswerSubmit = () => {
    if (!editingAnswer || !editingAnswer.value.trim()) return
    updateAnswer.mutate(
      { id: editingAnswer.id, traLoi: editingAnswer.value.trim() },
      { onSuccess: () => setEditingAnswer(null) }
    )
  }

  const handleDeleteAnswer = (id: number) => {
    deleteAnswer.mutate(id)
  }

  const sortedQuestions = [...questions].sort((a, b) => {
    const sa = typeof a.stt === 'number' ? a.stt! : Number.MAX_SAFE_INTEGER
    const sb = typeof b.stt === 'number' ? b.stt! : Number.MAX_SAFE_INTEGER
    if (sa !== sb) return sa - sb
    return (a.id || 0) - (b.id || 0)
  })
  const questionStart = (questionPage - 1) * questionPageSize
  const pagedQuestions = sortedQuestions.slice(questionStart, questionStart + questionPageSize)

  const getAnswerPage = (qid: number) => (answerPageByQuestion[qid] ?? 1)
  const getAnswerPageSize = (qid: number) => (answerPageSizeByQuestion[qid] ?? 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Câu hỏi và trả lời trắc nghiệm</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenCreate}
          className="gap-2"
          aria-label="Thêm câu hỏi"
        >
          <Plus className="w-4 h-4 text-blue-600" />
          Thêm câu hỏi
        </Button>
      </div>
      <Separator />
      {questions.length === 0 ? (
        <div className="text-gray-600">Chưa có câu hỏi</div>
      ) : (
        <div className="space-y-4">
          {pagedQuestions.map(q => (
            <div key={q.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">{typeof q.stt === 'number' ? `#${q.stt}` : '#-'}</div>
                  <div className="font-medium">{q.noiDung || '-'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditQuestion(q)}
                    className="gap-2"
                    aria-label="Sửa câu hỏi"
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuestion(q.id!)}
                    className="gap-2"
                    aria-label="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    Xóa
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700">Câu trả lời trắc nghiệm</div>
                <div className="mt-2 space-y-2">
                  {(() => {
                    const answers = q.answers || []
                    const ap = getAnswerPage(q.id!)
                    const asize = getAnswerPageSize(q.id!)
                    const start = (ap - 1) * asize
                    const pagedAnswers = answers.slice(start, start + asize)
                    return pagedAnswers.map(a => (
                    <div key={a.id} className="flex items-center justify-between rounded bg-gray-50 p-2">
                      {editingAnswer?.id === a.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <Input
                            value={editingAnswer!.value}
                            onChange={e => setEditingAnswer({ id: a.id!, value: e.target.value })}
                            aria-label="Sửa trả lời"
                            tabIndex={0}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleUpdateAnswerSubmit}
                            className="gap-2"
                            aria-label="Lưu trả lời"
                          >
                            Lưu
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAnswer(null)}
                            className="gap-2"
                            aria-label="Hủy sửa trả lời"
                          >
                            Hủy
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-800">{a.traLoi}</div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEditAnswer(a)}
                              className="gap-2"
                              aria-label="Sửa trả lời"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnswer(a.id!)}
                              className="gap-2"
                              aria-label="Xóa trả lời"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                              Xóa
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                  })()}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nhập câu trả lời..."
                      value={newAnswerByQuestion[q.id!] || ''}
                      onChange={e => setNewAnswerByQuestion(prev => ({ ...prev, [q.id!]: e.target.value }))}
                      aria-label="Thêm trả lời"
                      tabIndex={0}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddAnswer(q.id!)}
                      className="gap-2"
                      aria-label="Thêm trả lời"
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div>Trang {questionPage}</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setQuestionPage(Math.max(1, questionPage - 1))} aria-label="Trang trước">Trước</Button>
              <Button variant="ghost" size="sm" onClick={() => setQuestionPage(questionPage + 1)} aria-label="Trang sau">Sau</Button>
            </div>
            <div className="flex items-center gap-2">
              <span></span>
              <Input
                value={String(questionPageSize)}
                onChange={e => {
                  const n = Number(e.target.value)
                  if (!isNaN(n) && n > 0) setQuestionPageSize(n)
                }}
                className="w-20"
                aria-label="Kích thước trang câu hỏi"
                tabIndex={0}
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="Nội dung câu hỏi"
              value={newQuestionContent}
              onChange={e => setNewQuestionContent(e.target.value)}
              aria-label="Nội dung câu hỏi"
              tabIndex={0}
            />
            <Input
              placeholder="Thứ tự (tuỳ chọn)"
              value={newQuestionOrder}
              onChange={e => {
                const v = e.target.value
                const n = Number(v)
                setNewQuestionOrder(!v ? '' : isNaN(n) ? '' : n)
              }}
              aria-label="Thứ tự"
              tabIndex={0}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateQuestion} disabled={insertQuestion.isPending}>
              {insertQuestion.isPending ? 'Đang thêm...' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editQuestionDialog.open} onOpenChange={open => setEditQuestionDialog({ open, question: editQuestionDialog.question })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa câu hỏi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="Nội dung câu hỏi"
              value={newQuestionContent}
              onChange={e => setNewQuestionContent(e.target.value)}
              aria-label="Nội dung câu hỏi"
              tabIndex={0}
            />
            <Input
              placeholder="Thứ tự (tuỳ chọn)"
              value={newQuestionOrder}
              onChange={e => {
                const v = e.target.value
                const n = Number(v)
                setNewQuestionOrder(!v ? '' : isNaN(n) ? '' : n)
              }}
              aria-label="Thứ tự"
              tabIndex={0}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditQuestionDialog({ open: false, question: null })}>
              Hủy
            </Button>
            <Button onClick={handleUpdateQuestion} disabled={updateQuestion.isPending}>
              {updateQuestion.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
