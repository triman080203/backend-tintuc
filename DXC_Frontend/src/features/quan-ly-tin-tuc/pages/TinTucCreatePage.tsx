import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import { TinTucForm } from '../components'
import { getTinTucAdmin } from '@/api/endpoints/tin-tuc-admin'
import type { TinTucFormData } from '../schemas'

const TinTucCreatePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const submitRef = useRef<(() => void) | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: TinTucFormData) =>
      getTinTucAdmin().postApiAdminTintuc({
        title: data.title,
        summary: data.summary,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        categoryId: data.categoryId,
        tags: data.tags,
        authorName: data.authorName,
        attachmentPublicIds: data.attachmentPublicIds,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Tạo tin bài thành công')
        queryClient.invalidateQueries({ queryKey: ['tin-tuc-list'] })
        navigate('/tin-tuc')
      } else {
        toast.error(res.message || 'Có lỗi xảy ra')
      }
    },
    onError: (error: unknown) => {
      const err = error as any
      const message = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      toast.error(message)
    },
  })

  const handleSubmit = (data: TinTucFormData) => {
    createMutation.mutate(data)
  }

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
      title="Quản lý tin tức"
      description="Quản lý tin bài, duyệt và xuất bản tin tức trên Zalo Mini App"
      formTitle="Tạo bài viết mới"
      breadcrumbItems={[
        { label: 'Quản lý tin tức', href: '/tin-tuc' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tin-tuc')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>

          <ActionBarDivider />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tin-tuc')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu bản nháp'}
          </Button>
        </>
      }
    >
      <div className="bg-card border rounded-lg p-6 max-w-[800px] mx-auto">
        <TinTucForm
          onSubmit={handleSubmit}
          isEdit={false}
          onSave={(submit) => {
            submitRef.current = submit
          }}
        />
      </div>
    </FormPageLayout>
  )
}

export default TinTucCreatePage
