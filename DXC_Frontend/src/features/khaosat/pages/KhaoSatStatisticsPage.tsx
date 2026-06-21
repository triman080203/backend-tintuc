import { useMemo, useState } from 'react'
// removed unused navigate/Button
import { ListPageLayout, DataTable, type Column } from '@/shared/components'
import { getKhaoSatAdminApi } from '@/api/zalo-mini-app-khaosat-admin'
import { useQuery, useQueries } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePagination } from '@/shared/hooks'
// removed unused Input

type ThongKeChiTietCauTraLoiDto = { idCauHoi: number; cauHoi: string; idTraLoi?: number | null; traLoi: string }
type ThongKeChiTietUserDto = { idUser: number; hoTen: string; diaChi: string; cauTraLoi: ThongKeChiTietCauTraLoiDto[] }

export const KhaoSatStatisticsPage = () => {
  const [surveyId, setSurveyId] = useState<number | null>(null)
  const searchName = ''
  const { page, pageSize, setPage, setPageSize } = usePagination(20)
  const idUserFilter: number | undefined = undefined

  const { data: thongKeChiTiet, isLoading: isLoadingChoices, error: errorChoices } = useQuery({
    queryKey: ['khaosat-thongke-chitiet', surveyId],
    queryFn: () => getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosatThongkeChitiet({ SurveyId: Number(surveyId) }),
    enabled: !!surveyId && Number.isFinite(surveyId) && Number(surveyId) > 0,
  })

  const { data: essayResponsesResult, isLoading: isLoadingEssayResponses, error: errorEssayResponses } = useQuery({
    queryKey: ['khaosat-essay-responses-by-user', surveyId, idUserFilter],
    queryFn: () =>
      getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosatTuluanResponsesByUser({
        SurveyId: Number(surveyId),
        IDUser: idUserFilter,
      }),
    enabled: !!surveyId && Number.isFinite(surveyId) && Number(surveyId) > 0,
  })

  const { data: surveyList, isLoading: isListLoading } = useQuery({
    queryKey: ['khaosat-statistics-list', page, pageSize, searchName],
    queryFn: () =>
      getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosat({
        Current: page,
        PageSize: pageSize,
        TenKhaoSat: searchName || undefined,
      }),
  })

  // filter input removed

  // no-op helpers removed

  const thongKeChiTietUsers: ThongKeChiTietUserDto[] = useMemo(() => {
    const raw: any = thongKeChiTiet
    if (raw && Array.isArray(raw?.data)) return raw.data as ThongKeChiTietUserDto[]
    if (Array.isArray(raw)) return raw as ThongKeChiTietUserDto[]
    return []
  }, [thongKeChiTiet])

  type ChoiceAnswerStatRow = { AnswerId: number; TraLoi: string; Count: number; UserIds: number[] }
  type ChoiceQuestionStatRow = { QuestionId: number; NoiDung: string; TotalResponses: number; Answers: ChoiceAnswerStatRow[] }
  const choiceStats: ChoiceQuestionStatRow[] = useMemo(() => {
    const questionMap = new Map<number, { QuestionId: number; NoiDung: string; userSet: Set<number>; answers: Map<number, { AnswerId: number; TraLoi: string; userSet: Set<number> }> }>()
    thongKeChiTietUsers.forEach(user => {
      const uid = user.idUser
      ;(user.cauTraLoi || []).forEach(item => {
        if (item.idTraLoi == null) return
        const qid = item.idCauHoi
        const q = questionMap.get(qid) || { QuestionId: qid, NoiDung: item.cauHoi, userSet: new Set<number>(), answers: new Map() }
        q.userSet.add(uid)
        const a = q.answers.get(item.idTraLoi) || { AnswerId: item.idTraLoi, TraLoi: item.traLoi, userSet: new Set<number>() }
        a.userSet.add(uid)
        q.answers.set(item.idTraLoi, a)
        questionMap.set(qid, q)
      })
    })
    return Array.from(questionMap.values()).map(q => ({
      QuestionId: q.QuestionId,
      NoiDung: q.NoiDung,
      TotalResponses: q.userSet.size,
      Answers: Array.from(q.answers.values()).map(a => ({
        AnswerId: a.AnswerId,
        TraLoi: a.TraLoi,
        Count: a.userSet.size,
        UserIds: Array.from(a.userSet.values()),
      })),
    }))
  }, [thongKeChiTietUsers])

  const totalsQueries = useQueries({
    queries: (surveyId && choiceStats.length > 0)
      ? choiceStats.map(q => ({
          queryKey: ['khaosat-responses-users-total', surveyId, q.QuestionId],
          queryFn: () =>
            getKhaoSatAdminApi().getApiZaloMiniAppAdminKhaosatResponsesUsers({
              SurveyId: Number(surveyId),
              QuestionId: q.QuestionId,
              Current: 1,
              PageSize: 1,
            }),
          enabled: !!surveyId,
        }))
      : [],
  })
  const totalsByQuestion: Record<number, number> = useMemo(() => {
    const map: Record<number, number> = {}
    const ids = choiceStats.map(q => q.QuestionId)
    totalsQueries.forEach((res, idx) => {
      const qid = ids[idx]
      const data: any = res.data
      const total = data?.total ?? (Array.isArray(data?.data) ? data.data.length : undefined)
      if (qid != null && total != null) map[qid] = total
    })
    return map
  }, [totalsQueries, choiceStats])

  type EssayResponseByUserRow = { idUser: number; surveyId: number; essayQuestionId: number; cauHoiTuLuan: string; content: string; createdAt: string }
  const essayResponseRows: EssayResponseByUserRow[] = useMemo(() => {
    const raw: any = essayResponsesResult
    const arr: any[] = ((raw as any)?.data as any[]) || []
    return arr.map((r: any) => ({
      idUser: r.idUser ?? r.IDUser ?? 0,
      surveyId: r.surveyId ?? r.SurveyId ?? Number(surveyId),
      essayQuestionId: r.essayQuestionId ?? r.EssayQuestionId ?? 0,
      cauHoiTuLuan: r.cauHoiTuLuan ?? r.CauHoiTuLuan ?? '',
      content: r.content ?? r.Content ?? '',
      createdAt: r.createdAt ?? r.CreatedAt ?? '',
    }))
  }, [essayResponsesResult, surveyId])

  type StatsSurveyRow = { id: number; name: string; thoiGian: string; isActive: boolean; createdAt: string }
  const surveyRows: StatsSurveyRow[] = useMemo(() => {
    const arr: any[] = ((surveyList as any)?.data as any[]) || []
    return arr.map((s: any) => ({
      id: s.id ?? s.Id ?? 0,
      name: s.tenKhaoSat ?? s.TenKhaoSat ?? '',
      thoiGian: s.thoiGian ?? s.ThoiGian ?? '',
      isActive: s.isActive ?? s.IsActive ?? false,
      createdAt: s.createdAt ?? s.CreatedAt ?? '',
    }))
  }, [surveyList])

  const surveyColumns: Column<StatsSurveyRow>[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Tên khảo sát', width: '240px' },
    {
      key: 'thoiGian',
      label: 'Thời gian',
      width: '180px',
      render: (value: string) => {
        const d = value ? new Date(value) : null
        return d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
      },
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      width: '140px',
      render: (value: boolean) => (
        <span className={value ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      width: '180px',
      render: (value: string) => {
        const d = value ? new Date(value) : null
        return d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
      },
    },
    {
      key: 'actions',
      label: 'Thống kê',
      width: '140px',
      render: (_: unknown, row: StatsSurveyRow) => (
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`Xem thống kê khảo sát ${row.name}`}
          tabIndex={0}
          onClick={() => setSurveyId(row.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setSurveyId(row.id)
          }}
        >
          Xem
        </button>
      ),
    },
  ]

  return (
    <ListPageLayout
      title="Thống kê khảo sát"
      description="Xem thống kê trả lời cho khảo sát"
      breadcrumbItems={[
        { label: 'Quản lý khảo sát', href: '/khaosat' },
        { label: 'Thống kê', current: true },
      ]}
    >
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            <DataTable<StatsSurveyRow>
              columns={surveyColumns}
              data={surveyRows}
              isLoading={isListLoading}
              pagination={{
                current: page,
                total: (surveyList as any)?.total || 0,
                pageSize,
                onChange: setPage,
                onPageSizeChange: setPageSize,
              }}
              rowKey="id"
              className="text-sm"
            />
          </CardContent>
        </Card>

        {surveyId && (
          <Card>
            <CardHeader>
              <CardTitle>Thống kê câu hỏi trắc nghiệm</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingChoices ? (
                <div className="py-6 text-sm text-muted-foreground">Đang tải dữ liệu...</div>
              ) : errorChoices ? (
                <div className="py-6 text-sm text-red-600">Lỗi tải thống kê: {(errorChoices as Error).message}</div>
              ) : choiceStats.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">Không có dữ liệu trắc nghiệm</div>
              ) : (
                <div className="space-y-6">
                  {choiceStats.map(q => (
                    <div key={q.QuestionId} className="border rounded-md p-4">
                      <div className="font-semibold mb-2">{q.NoiDung}</div>
                      <div className="text-sm text-muted-foreground mb-3">Tổng lượt trả lời: {q.TotalResponses}</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left">
                              <th className="py-2 pr-4">STT</th>
                              <th className="py-2 pr-4">Đáp án</th>
                              <th className="py-2 pr-4">Số lượng</th>
                              <th className="py-2 pr-4">Tỷ lệ</th>
                               {/* <th className="py-2 pr-4">UserId</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {(q.Answers || []).map((a, idx) => {
                              const sumCount = (q.Answers || []).reduce((s, x) => s + (x.Count ?? 0), 0)
                              const baseTotal = totalsByQuestion[q.QuestionId] ?? sumCount
                              const Total = baseTotal > 0 ? baseTotal : 1
                              const Count = a.Count ?? 0
                              const percent = ((Count / Total) * 100).toFixed(1)
                              return (
                                <tr key={a.AnswerId} className="border-t">
                                  <td className="py-2 pr-4">{idx + 1}</td>
                                  <td className="py-2 pr-4">{a.TraLoi}</td>
                                  <td className="py-2 pr-4">{Count}</td>
                                  <td className="py-2 pr-4">{percent}%</td>
                                  {/* <td className="py-2 pr-4">
                                    {a.UserIds?.length ? a.UserIds.join(', ') : '-'}
                                  </td> */}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {surveyId && (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách trả lời câu hỏi tự luận</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEssayResponses ? (
                <div className="py-6 text-sm text-muted-foreground">Đang tải dữ liệu...</div>
              ) : errorEssayResponses ? (
                <div className="py-6 text-sm text-red-600">Lỗi tải tự luận: {(errorEssayResponses as Error).message}</div>
              ) : essayResponseRows.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">Không có dữ liệu tự luận</div>
              ) : (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="py-2 pr-4">STT</th>
                          <th className="py-2 pr-4">UserId</th>
                          <th className="py-2 pr-4">SurveyId</th>
                          <th className="py-2 pr-4">QuestionId</th>
                          <th className="py-2 pr-4">Câu hỏi</th>
                          <th className="py-2 pr-4">Nội dung</th>
                          <th className="py-2 pr-4">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {essayResponseRows.map((e, idx) => {
                          const d = e.createdAt ? new Date(e.createdAt) : null
                          const timeText = d && !isNaN(d.getTime()) ? d.toLocaleString('vi-VN') : '-'
                          return (
                            <tr key={`${e.essayQuestionId}-${idx}-${e.idUser}`} className="border-t">
                              <td className="py-2 pr-4">{idx + 1}</td>
                              <td className="py-2 pr-4">{e.idUser}</td>
                              <td className="py-2 pr-4">{e.surveyId}</td>
                              <td className="py-2 pr-4">{e.essayQuestionId}</td>
                              <td className="py-2 pr-4">{e.cauHoiTuLuan || '-'}</td>
                              <td className="py-2 pr-4">{e.content || '-'}</td>
                              <td className="py-2 pr-4">{timeText}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">Tổng: {essayResponseRows.length}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ListPageLayout>
  )
}

export default KhaoSatStatisticsPage
