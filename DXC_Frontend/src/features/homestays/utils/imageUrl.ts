export const buildImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined
  // Sử dụng relative path để Vite proxy tự động chuyển tiếp đến backend
  return `${imageUrl}`
}
