# STEP 6: Optional Image Upload (Image Gallery & Upload)

## Overview

Add optional image upload functionality to your feature for visual content management.

**Estimated time**: 30-45 minutes  
**Depends on**: STEP_0-5 completed  
**When to use**: Only if your feature has image-related fields

⚠️ **OPTIONAL STEP**: This step is optional. Only implement if:
- API has file upload endpoints (check for `postApiFilesUpload`)
- DTO includes image fields (`images?: ImageDto[]`, `imageUrl?: string`)
- Feature requires visual content (Hotels, Restaurants, Products, etc.)

---

## Decision Tree: Do You Need Image Upload?

```
Check your generated API types (src/api/models/index.ts)
                    ↓
    Does your DTO have image fields?
    (images[], imageUrl, photo, etc.)
                    ↓
            ┌───────┴────────┐
           YES               NO
            ↓                 ↓
    Continue with    Skip STEP 6
    STEP 6            Done!
            ↓
    Are images      
    stored in API?
    (not external)
            ↓
           YES → Implement STEP 6
            ↓
    Complete image upload
    upload integration
```

### Examples

**Features WITH images (need STEP 6)**:
- ✅ Hotels: `HotelWithImagesDto` has `images: HotelImageDto[]`
- ✅ Restaurants: `RestaurantDto` has `images: RestaurantImageDto[]`
- ✅ Products: Has image gallery
- ✅ Gallery: Has multiple images

**Features WITHOUT images (skip STEP 6)**:
- ❌ Roles: No image fields
- ❌ Departments: No image fields
- ❌ Users: Only avatar, handle separately
- ❌ Settings: Configuration only

---

## Files to Create

```
src/features/[feature-name]/
├── utils/
│   └── imageUrl.ts                 ← URL builder utility (new)
├── hooks/
│   └── use[Feature]ImageUpload.ts  ← Image upload hook (new)
└── components/
    ├── [Feature]ImageUploader.tsx  ← Upload UI component (new)
    └── ImageGallery.tsx            ← Lightbox gallery (new - shared)
```

## Files to Modify

```
src/features/[feature-name]/
├── components/[Feature]Form.tsx           ← Add image section + state
└── pages/[Feature]DetailPage.tsx          ← Add image gallery display
```

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Image Upload Data Flow          │
└─────────────────────────────────────────┘

buildImageUrl()
    ↓ (converts API paths to full URLs)
    ↓
use[Feature]ImageUpload Hook
    ↓ (manages upload state, validation)
    ├→ uploadedImages (newly uploaded)
    ├→ isUploading (progress tracking)
    ├→ handleUpload (drag-drop handler)
    ├→ removeImage (delete uploaded)
    └→ getPublicIds (collect IDs)
    ↓
[Feature]ImageUploader Component
    ├→ Drag-drop zone UI
    ├→ File validation (5MB)
    ├→ Existing images display (green)
    ├→ New images display (blue)
    └→ Upload progress
    ↓
RestaurantForm Integration
    ├→ Add imagePublicIds to schema
    ├→ Pass images to uploader
    ├→ Collect IDs on upload
    └→ Include in form submission
    ↓
ImageGallery Component
    ├→ Grid display (responsive)
    ├→ Lightbox on click
    ├→ Keyboard navigation
    └→ Thumbnail strip
    ↓
[Feature]DetailPage
    └→ Display gallery conditionally
```

---

## Step 1: Create Image URL Utility

**File**: `src/features/[feature-name]/utils/imageUrl.ts`

This simple utility converts API-relative image paths to full URLs.

**Why needed**: Backend returns paths like `"uploads/image.jpg"`, nhưng với Vite Proxy chúng ta có thể dùng relative path

```typescript
export const buildImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null
  // Sử dụng relative path để Vite Proxy tự động forward đến backend
  return `/${imageUrl}`
}
```

**Usage**:
```typescript
const fullUrl = buildImageUrl(image.imageUrl)
// "uploads/photo.jpg" → "/uploads/photo.jpg" (sẽ được proxy đến backend)
```

**Lưu ý**: Project này sử dụng Vite Proxy nên không cần `VITE_API_BASE_URL`. Tất cả API calls sẽ tự động được forward đến backend thông qua proxy configuration trong `vite.config.ts`.

---

## Step 2: Create Image Upload Hook

**File**: `src/features/[feature-name]/hooks/use[Feature]ImageUpload.ts`

Core logic for handling image uploads with validation and state management.

### Hook API

```typescript
const { 
  uploadedImages,      // UploadedImage[] - newly uploaded images
  isUploading,         // boolean - upload in progress
  handleUpload,        // (files) => void - upload files
  removeImage,         // (uid) => void - remove single image
  clearImages,         // () => void - clear all uploaded
  getPublicIds         // () => string[] - get public IDs for form
} = use[Feature]ImageUpload()
```

### Full Implementation

```typescript
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getFiles } from '@/api/endpoints/files'
import type { UploadFileResponseDto } from '@/api/models'
import { toast } from 'sonner'

interface UploadedImage {
  publicId: string
  name: string
  url: string
  uid: string
}

export const use[Feature]ImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (body: { files: File[] }) =>
      getFiles().postApiFilesUpload({
        ...body,
        entityType: '[Feature]',  // ← Change to your feature name
      }),
    onSuccess: (result) => {
      if (result.success && result.data) {
        const newImages: UploadedImage[] = result.data.map((file: UploadFileResponseDto) => ({
          publicId: file.publicId || '',
          name: file.name || 'Unknown',
          url: file.url || '',
          uid: file.uid || file.publicId || `img-${Date.now()}-${Math.random()}`,
        }))
        setUploadedImages((prev) => [...prev, ...newImages])
        toast.success(`Đã tải lên ${newImages.length} ảnh thành công`)
      }
    },
    onError: (error: Error) => {
      toast.error('Tải lên ảnh thất bại', {
        description: error.message,
      })
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const fileArray = Array.from(files)

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const invalidFiles = fileArray.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast.error('Có ảnh vượt quá kích thước cho phép', {
        description: `Kích thước tối đa: 5MB. Ảnh lỗi: ${invalidFiles.map((f) => f.name).join(', ')}`,
      })
      setIsUploading(false)
      return
    }

    // Upload files
    uploadMutation.mutate({ files: fileArray })
  }

  const removeImage = (uid: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.uid !== uid))
  }

  const clearImages = () => {
    setUploadedImages([])
  }

  const getPublicIds = (): string[] => {
    return uploadedImages.map((img) => img.publicId)
  }

  return {
    uploadedImages,
    isUploading,
    handleUpload,
    removeImage,
    clearImages,
    getPublicIds,
  }
}
```

**Key Points**:
- ✅ File size validation: 5MB limit enforced
- ✅ API call: `getFiles().postApiFilesUpload()` with `entityType` parameter
- ✅ Error handling: Show detailed toast with filename if file too large
- ✅ Success handling: Show count of uploaded images
- ✅ State: Combine new images with existing ones

---

## Step 3: Create Image Uploader Component

**File**: `src/features/[feature-name]/components/[Feature]ImageUploader.tsx`

UI component for drag-drop image upload with validation and display.

### Props

```typescript
interface [Feature]ImageUploaderProps {
  onImagesUploaded: (publicIds: string[]) => void    // Callback when images change
  disabled?: boolean                                  // Disable during form submit
  onUploadingChange?: (isUploading: boolean) => void  // Notify parent of upload state
  existingImages?: ImageDto[]                         // Current images (edit mode)
}
```

### Full Implementation

```typescript
import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { use[Feature]ImageUpload } from '../hooks/use[Feature]ImageUpload'
import { buildImageUrl } from '../utils/imageUrl'
import type { [Feature]ImageDto } from '@/api/models'

interface [Feature]ImageUploaderProps {
  onImagesUploaded: (publicIds: string[]) => void
  disabled?: boolean
  onUploadingChange?: (isUploading: boolean) => void
  existingImages?: [Feature]ImageDto[]
}

export function [Feature]ImageUploader({
  onImagesUploaded,
  disabled = false,
  onUploadingChange,
  existingImages = [],
}: [Feature]ImageUploaderProps) {
  const { uploadedImages, isUploading, handleUpload, removeImage } = use[Feature]ImageUpload()
  const [isDragging, setIsDragging] = useState(false)
  const lastSyncRef = useRef<string>('')

  // Notify parent of upload state changes
  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  // Sync all images (existing + new) to parent
  useEffect(() => {
    const allPublicIds = [
      ...existingImages.map((img) => img.publicId).filter((id): id is string => !!id),
      ...uploadedImages.map((img) => img.publicId),
    ]
    const currentSync = JSON.stringify(allPublicIds)
    
    if (currentSync !== lastSyncRef.current) {
      lastSyncRef.current = currentSync
      onImagesUploaded(allPublicIds)
    }
  }, [uploadedImages, existingImages.length, onImagesUploaded])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
        } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          id="[feature]-image-input"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <label
          htmlFor="[feature]-image-input"
          className="flex flex-col items-center justify-center cursor-pointer gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Kéo và thả ảnh hoặc click để chọn
          </p>
          <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG (tối đa 5MB mỗi ảnh)</p>
        </label>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
          Đang tải lên...
        </div>
      )}

      {/* Existing Images Section */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Ảnh hiện tại ({existingImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((image, index) => {
              const imageUrl = buildImageUrl(image.imageUrl)
              return (
                <div key={`existing-${image.publicId || index}`} className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.caption || `Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md border-2 border-green-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Chính
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {image.caption || image.imageUrl || 'Ảnh'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* New Images Section */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Ảnh mới thêm ({uploadedImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image) => {
              const imageUrl = buildImageUrl(image.url)
              return (
                <div key={image.uid} className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded-md border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md border-2 border-blue-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(image.uid)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
```

**Key Features**:
- ✅ Drag-drop with visual feedback (isDragging state)
- ✅ Click to select files (hidden input)
- ✅ Show existing images (green border, primary badge)
- ✅ Show new images (blue border, delete button)
- ✅ Upload progress indicator
- ✅ Responsive grid (2-4 columns)
- ✅ useRef sync to prevent infinite callbacks

---

## Step 4: Create Image Gallery Component

**File**: `src/features/[feature-name]/components/ImageGallery.tsx`

Display images in responsive grid with full-screen lightbox.

### Props

```typescript
interface ImageGalleryProps {
  images: [Feature]ImageDto[]
}
```

### Full Implementation

```typescript
import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { [Feature]ImageDto } from '@/api/models'
import { buildImageUrl } from '../utils/imageUrl'

interface ImageGalleryProps {
  images: [Feature]ImageDto[]
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Không có ảnh để hiển thị</p>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsFullscreen(true)
  }

  const closeLightbox = () => {
    setCurrentImageIndex(null)
    setIsFullscreen(false)
  }

  const goToPrevious = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      )
    }
  }

  const goToNext = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex(
        currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    } else if (e.key === 'ArrowLeft') {
      goToPrevious()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    }
  }

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {images.map((image, index) => {
          const imageUrl = buildImageUrl(image.imageUrl)
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-md cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={image.caption || `Image ${index + 1}`}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Không có ảnh</span>
                </div>
              )}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs truncate">{image.caption}</p>
                </div>
              )}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Ảnh chính
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {isFullscreen && currentImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Previous Button */}
          <button
            className="absolute left-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          {/* Next Button */}
          <button
            className="absolute right-4 text-white p-2 rounded-full hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Ảnh sau"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          {/* Image Display */}
          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {images[currentImageIndex]?.imageUrl ? (
              <img
                src={buildImageUrl(images[currentImageIndex].imageUrl) || undefined}
                alt={images[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
                className="max-h-[70vh] object-contain"
              />
            ) : (
              <div className="max-h-[70vh] bg-gray-800 flex items-center justify-center w-full">
                <span className="text-gray-300">Không thể tải ảnh</span>
              </div>
            )}

            {/* Image Info */}
            <div className="mt-4 text-white text-center">
              <p className="font-medium">
                {images[currentImageIndex].caption || `Ảnh ${currentImageIndex + 1}`}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </div>
          
          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto py-2">
            {images.map((image, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 ${
                  idx === currentImageIndex ? 'border-white' : 'border-transparent'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                aria-label={`Image ${idx + 1}`}
              >
                {image.imageUrl ? (
                  <img
                    src={buildImageUrl(image.imageUrl) || undefined}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-400">?</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
```

**Key Features**:
- ✅ Responsive grid (1-4 columns)
- ✅ Lightbox on click
- ✅ Navigation arrows (previous/next)
- ✅ Keyboard support (Escape, Arrow keys)
- ✅ Thumbnail strip at bottom
- ✅ Image counter
- ✅ Captions displayed
- ✅ Primary badge support
- ✅ Circular navigation

---

## Step 5: Integrate into Form Component

**File**: `src/features/[feature-name]/components/[Feature]Form.tsx`

Update form to include image upload section.

### Changes to Make

**1. Add imports**:
```typescript
import { useCallback, useState } from 'react'
import { [Feature]ImageUploader } from './[Feature]ImageUploader'
```

**2. Update Zod schema**:
```typescript
const [featureFormSchema] = z.object({
  // ... existing fields ...
  imagePublicIds: z.array(z.string()).optional(),
})
```

**3. Add to defaultValues**:
```typescript
const form = useForm<[Feature]FormData>({
  defaultValues: {
    // ... existing fields ...
    imagePublicIds: initialData?.images?.map(img => img.publicId || '').filter(Boolean),
  }
})
```

**4. Add state and callbacks**:
```typescript
const [isImageUploading, setIsImageUploading] = useState(false)

const handleImagesUploaded = useCallback((publicIds: string[]) => {
  form.setValue('imagePublicIds', publicIds)
}, [form])

const handleUploadingChange = useCallback((uploading: boolean) => {
  setIsImageUploading(uploading)
}, [])
```

**5. Update onSubmit validation**:
```typescript
const onSubmit = async (data: [Feature]FormData) => {
  // Prevent submit during upload
  if (isImageUploading) {
    return
  }

  const submitData = {
    // ... existing fields ...
    imagePublicIds: data.imagePublicIds?.length ? data.imagePublicIds : null,
  }
  
  // ... rest of mutation logic ...
}
```

**6. Add form section** (before closing `</form>`):
```typescript
{/* Image Upload */}
<div className="space-y-4">
  <h3 className="text-sm font-semibold text-gray-900">Ảnh [feature]</h3>
  <FormField
    control={form.control}
    name="imagePublicIds"
    render={() => (
      <FormItem>
        <FormControl>
          <[Feature]ImageUploader
            onImagesUploaded={handleImagesUploaded}
            onUploadingChange={handleUploadingChange}
            disabled={createMutation.isPending || updateMutation.isPending}
            existingImages={initialData?.images || []}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
```

---

## Step 6: Integrate into Detail Page

**File**: `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

Display image gallery in detail page.

### Changes to Make

**1. Add import**:
```typescript
import { ImageGallery } from '../components/ImageGallery'
```

**2. Add section** (after profile, before delete dialog):
```typescript
{/* Images Section */}
{feature.images && feature.images.length > 0 && (
  <div className="border-t pt-6">
    <h3 className="text-sm font-semibold text-gray-600 mb-4">Ảnh [feature]</h3>
    <ImageGallery images={feature.images} />
  </div>
)}
```

---

## UI/UX Guidelines

### Colors & Styling

**Upload Zone**:
- Border: Gray-200 (default), Gray-300 (hover), Primary color (drag)
- Background: Transparent (default), Primary/5 (drag)
- Transition: 200ms

**Existing Images**:
- Border: Green-200 (2px)
- Badge "Chính": Green-500 bg, white text, top-left corner

**New Images**:
- Border: Blue-200 (2px)
- Delete button: Red-500, hover visible with opacity transition

**Grid Layout**:
- Mobile: 2 columns
- Tablet (sm): 3 columns
- Desktop (md): 4 columns
- Gap: 4 (16px)
- Height: h-24 (96px)

**Lightbox**:
- Background: Black/90 (fixed inset-0)
- Image display: max-h-[70vh], object-contain
- Buttons: Rounded-full, p-2, hover:bg-white/20
- Thumbnail: w-16 h-12, border-2 (white when active)

### Icons

- Upload zone: `Upload` from lucide-react
- Delete: `Trash2` from lucide-react
- Image placeholder: `Image` from lucide-react
- Lightbox: `X`, `ChevronLeft`, `ChevronRight` from lucide-react

### Typography

- Labels: text-sm font-semibold text-gray-700
- Sections: text-sm font-medium text-gray-700
- Captions: text-xs text-gray-600 truncate
- Loading: text-sm text-gray-600
- Empty state: text-center text-gray-500

---

## Build Verification

After each component created, run:

```bash
pnpm run build
```

**Expected results**:
- ✅ 0 TypeScript errors
- ✅ 0 ESLint warnings
- ✅ Build completes in ~1.7s
- ✅ No unused imports

---

## Acceptance Criteria

### Functionality
- ✅ Upload via drag-drop works
- ✅ Upload via file picker works
- ✅ File size validation enforced (reject >5MB)
- ✅ Upload progress displays
- ✅ Success toast shows count
- ✅ Error toast on failure with details
- ✅ Existing images display (green border)
- ✅ New images display (blue border)
- ✅ Delete button removes new images
- ✅ Images persist in form
- ✅ Form submit prevented during upload
- ✅ Detail page shows image gallery
- ✅ Lightbox opens on click
- ✅ Navigation arrows work
- ✅ Keyboard navigation works (Escape, Arrows)
- ✅ Thumbnail strip responds to clicks
- ✅ Image counter updates

### UI/UX
- ✅ Responsive on mobile (2 cols)
- ✅ Responsive on tablet (3 cols)
- ✅ Responsive on desktop (4 cols)
- ✅ Colors match specification
- ✅ Icons render correctly
- ✅ Hover effects work
- ✅ Drag visual feedback visible
- ✅ Captions display correctly
- ✅ Primary badge visible when applicable

### Code Quality
- ✅ 0 TypeScript errors
- ✅ 0 `any` types
- ✅ No unused imports
- ✅ Consistent naming
- ✅ Proper error handling
- ✅ Toast notifications appear

---

## Common Issues & Solutions

### Issue: Files upload but don't show

**Cause**: `buildImageUrl()` returning null

**Solution**: 
- Check `VITE_API_BASE_URL` is set in `.env`
- Verify API path format (should be relative like "uploads/image.jpg")

### Issue: Form submits during upload

**Cause**: `isImageUploading` check missing

**Solution**:
- Verify `onSubmit` has: `if (isImageUploading) return`
- Check `handleUploadingChange` is connected to uploader

### Issue: Images don't persist after form submit

**Cause**: `imagePublicIds` not in submitData

**Solution**:
- Verify `imagePublicIds` added to submitData object
- Check API accepts `imagePublicIds` field

### Issue: Lightbox doesn't respond to keyboard

**Cause**: Keyboard handler not attached to div

**Solution**:
- Verify `onKeyDown={handleKeyDown}` on grid div
- Verify `tabIndex={0}` on grid

### Issue: Images blurry in lightbox

**Cause**: Wrong object-fit or max dimensions

**Solution**:
- Use `object-contain` not `object-cover` for lightbox
- Set `max-h-[70vh]` for proper scaling

---

## Reference Implementation

See working examples:

- **Hotels**: `src/features/hotels/` (complete implementation)
- **Restaurants**: `src/features/restaurants/` (complete implementation)

Both features implement STEP_6 with all components and integration.

---

## Final Checklist

- [ ] `utils/imageUrl.ts` created
- [ ] `hooks/use[Feature]ImageUpload.ts` created
- [ ] `components/[Feature]ImageUploader.tsx` created
- [ ] `components/ImageGallery.tsx` created
- [ ] `components/[Feature]Form.tsx` updated
- [ ] `pages/[Feature]DetailPage.tsx` updated
- [ ] Build passes (0 errors)
- [ ] Upload works (drag-drop and click)
- [ ] File validation works (5MB limit)
- [ ] Images display in form
- [ ] Images display in detail page
- [ ] Lightbox works with keyboard navigation
- [ ] Mobile responsive
- [ ] Toast notifications appear
- [ ] No console errors

---

## What's Next?

After completing STEP 6:
1. ✅ Feature complete with full image support
2. Test in browser thoroughly
3. Deploy to staging for QA testing
4. Gather feedback and refine
5. Deploy to production

Congratulations! Your feature now has complete image upload functionality! 🎉
