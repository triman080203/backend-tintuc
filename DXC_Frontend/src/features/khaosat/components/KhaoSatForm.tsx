import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CreateSurveyCommand, UpdateSurveyCommand, SurveyDetailDto } from '@/api/models'

type Props = {
  initial?: SurveyDetailDto | null
  onSubmit: (data: CreateSurveyCommand | UpdateSurveyCommand) => void
  submitting: boolean
  mode: 'create' | 'edit'
  onSave?: (submit: () => void) => void
}

export const KhaoSatForm = ({ initial, onSubmit, submitting, mode, onSave }: Props) => {
  const [ten, setTen] = useState(initial?.tenKhaoSat || '')
  const [thoiGian, setThoiGian] = useState(
    initial?.thoiGian ? initial.thoiGian.slice(0, 16) : new Date().toISOString().slice(0, 16)
  )
  const [displayWebsite, setDisplayWebsite] = useState(
    initial?.displayWebsite === 'true' ? 'true' : 'false'
  )
  const [header, setHeader] = useState(initial?.header || '')
  const [footer, setFooter] = useState(initial?.footer || '')
  const [veViec, setVeViec] = useState(initial?.veViec || '')
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true)

  const handleSubmit = () => {
    if (!ten.trim()) return
    const payloadBase = {
      tenKhaoSat: ten.trim(),
      thoiGian: new Date(thoiGian).toISOString(),
      displayWebsite: displayWebsite || null,
      header: header || null,
      footer: footer || null,
      veViec: veViec || null,
    }
    if (mode === 'create') {
      const payload: CreateSurveyCommand = payloadBase
      onSubmit(payload)
      return
    }
    const payload: UpdateSurveyCommand = {
      id: initial?.id || 0,
      ...payloadBase,
      isActive: isActive,
    }
    onSubmit(payload)
  }

  useEffect(() => {
    if (onSave) onSave(handleSubmit)
  }, [ten, thoiGian, displayWebsite, header, footer, veViec, isActive, onSave])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tên khảo sát</label>
          <Input
            value={ten}
            onChange={e => setTen(e.target.value)}
            placeholder="Nhập tên khảo sát"
            aria-label="Tên khảo sát"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSubmit()
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Thời gian</label>
          <Input
            type="datetime-local"
            value={thoiGian}
            onChange={e => setThoiGian(e.target.value)}
            aria-label="Thời gian khảo sát"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSubmit()
            }}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Website</label>
          <Select
            value={displayWebsite}
            onValueChange={(v) => setDisplayWebsite(v)}
            disabled={submitting}
          >
            <SelectTrigger aria-label="Display Website">
              <SelectValue placeholder="Chọn hiển thị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Hiển thị</SelectItem>
              <SelectItem value="false">Ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Trạng thái</label>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <span className={isActive ? 'text-green-600' : 'text-gray-500'}>
              {isActive ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Header</label>
        <Textarea
          value={header || ''}
          onChange={e => setHeader(e.target.value)}
          placeholder="Nội dung header"
          aria-label="Header khảo sát"
          tabIndex={0}
          disabled={submitting}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Footer</label>
        <Textarea
          value={footer || ''}
          onChange={e => setFooter(e.target.value)}
          placeholder="Nội dung footer"
          aria-label="Footer khảo sát"
          tabIndex={0}
          disabled={submitting}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Về việc</label>
        <Textarea
          value={veViec || ''}
          onChange={e => setVeViec(e.target.value)}
          placeholder="Nội dung về việc"
          aria-label="Về việc khảo sát"
          tabIndex={0}
          disabled={submitting}
        />
      </div>

      
    </div>
  )
}
