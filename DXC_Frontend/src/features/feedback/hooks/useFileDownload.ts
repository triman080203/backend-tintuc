import { toast } from 'sonner'
import { getFiles } from '@/api/endpoints/files'

interface UseFileDownloadOptions {
  onSuccess?: (fileName: string) => void
  onError?: (error: Error) => void
}

export const useFileDownload = (options: UseFileDownloadOptions = {}) => {
  const downloadFile = async (filePublicId: string, fileName: string) => {
    try {
      const { getApiFilesPublicId } = getFiles()
      const response = await getApiFilesPublicId(filePublicId)
      
      // Create blob URL and trigger download
      const blob = new Blob([response], { type: response.type })
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'file'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up URL object
      window.URL.revokeObjectURL(url)
      
      toast.success(`Tải xuống thành công: ${fileName}`)
      
      options.onSuccess?.(fileName)
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Không thể tải xuống tệp. Vui lòng thử lại.')
      
      options.onError?.(error as Error)
    }
  }

  return { downloadFile }
}
