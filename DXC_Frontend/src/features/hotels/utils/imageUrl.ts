export const buildImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null
  // Sử dụng relative path để Vite proxy tự động chuyển tiếp đến backend
  return `${imageUrl}`
}
