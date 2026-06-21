import { Image as ImageIcon, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { buildImageUrl } from '../utils/imageUrl'
import { getFiles } from '@/api/endpoints/files'

interface BannerImageDisplayProps {
  imageUrl?: string | null
  imagePublicId?: string | null
  alt?: string
  className?: string
}

export function BannerImageDisplay({
  imageUrl,
  imagePublicId,
  alt = 'Banner',
  className = 'w-full max-w-xl h-48 object-cover rounded-md border',
}: BannerImageDisplayProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)

  const fullImageUrl = useMemo(() => buildImageUrl(imageUrl), [imageUrl])

  useEffect(() => {
    let active = true
    let currentUrl: string | null = null

    setError(null)
    setBlobUrl(null)

    if (imagePublicId) {
      setLoading(true)
      getFiles()
        .getApiFilesPublicId(imagePublicId)
        .then((res) => {
          if (!active) return
          const blob = res
          const url = URL.createObjectURL(blob)
          currentUrl = url
          setBlobUrl(url)
        })
        .catch((e: Error) => {
          if (!active) return
          setError(e.message || 'Không thể tải ảnh')
        })
        .finally(() => {
          if (!active) return
          setLoading(false)
        })
    }

    return () => {
      active = false
      if (currentUrl) URL.revokeObjectURL(currentUrl)
    }
  }, [imagePublicId])

  const finalSrc = blobUrl || fullImageUrl || null

  if (!finalSrc) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}> 
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    )
  }

  return (
    <>
      {loading ? (
        <div className={`${className} bg-gray-100 animate-pulse`} />
      ) : error ? (
        <div className={`${className} bg-gray-100 flex items-center justify-center text-sm text-gray-500`}>Lỗi tải ảnh</div>
      ) : (
        <img
          src={finalSrc}
          alt={alt}
          className={className}
          loading="lazy"
          onClick={() => setZoomOpen(true)}
        />
      )}

      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation()
              setZoomOpen(false)
            }}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={finalSrc}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
