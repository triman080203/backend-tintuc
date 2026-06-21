import React, { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; error: string }>
}

interface UserImportProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const UserImport: React.FC<UserImportProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const importMutation = useMutation({
    mutationFn: async (_selectedFile: File): Promise<ImportResult> => {
      // Simulate file processing - in a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock result - in a real app, this would be the actual API response
      return {
        success: 8,
        failed: 2,
        errors: [
          { row: 3, error: 'Email đã tồn tại' },
          { row: 7, error: 'Dữ liệu không hợp lệ' }
        ]
      }
    },
    onSuccess: (result) => {
      setImportResult(result)
      if (result.success > 0) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        toast.success(`Import thành công ${result.success} người dùng`)
        onSuccess?.()
      }
      if (result.failed > 0) {
        toast.error(`Import thất bại ${result.failed} người dùng`)
      }
    },
    onError: (error: Error) => {
      toast.error('Import thất bại', {
        description: error.message,
      })
    },
  })

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Chỉ chấp nhận file CSV')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File không được vượt quá 5MB')
      return
    }

    setFile(selectedFile)
    setImportResult(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    try {
      await importMutation.mutateAsync(file)
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      'fullName,userName,email,password,roleCodes',
      'Nguyễn Văn A,nguyenvana,nguyenvana@example.com,Password123,admin;user',
      'Trần Thị B,tranthib,tranthib@example.com,Password123,user'
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import người dùng
        </CardTitle>
        <CardDescription>
          Import danh sách người dùng từ file CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {importResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">
                        Thành công: {importResult.success}
                      </span>
                    </div>
                    {importResult.failed > 0 && (
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium">
                          Thất bại: {importResult.failed}
                        </span>
                      </div>
                    )}
                  </div>

                  {importResult.errors.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">Lỗi import:</p>
                          {importResult.errors.map((error, index) => (
                            <p key={index} className="text-sm">
                              Dòng {error.row}: {error.error}
                            </p>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleImport}
                    disabled={isImporting}
                    className="w-full"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang import...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import người dùng
                      </>
                    )}
                  </Button>

                  {isImporting && (
                    <Progress value={66} className="w-full" />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">Kéo thả file CSV vào đây</p>
                <p className="text-sm text-muted-foreground">
                  Hoặc click để chọn file
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn file
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    handleFileSelect(selectedFile)
                  }
                }}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Cần file mẫu?</p>
            <p className="text-sm text-muted-foreground">
              Tải xuống file CSV mẫu để biết định dạng
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Tải mẫu
          </Button>
        </div>

        {/* Format Guide */}
        <div className="space-y-3">
          <h4 className="font-medium">Hướng dẫn định dạng CSV:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Cột bắt buộc:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• fullName: Tên đầy đủ</li>
                <li>• userName: Tên đăng nhập</li>
                <li>• email: Địa chỉ email</li>
                <li>• password: Mật khẩu</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Cột tùy chọn:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• roleCodes: Vai trò (cách nhau bởi dấu chấm phẩy)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {onCancel && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onCancel}>
              Đóng
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}