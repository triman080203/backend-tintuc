import { useState, useCallback } from 'react'

interface UseDeleteConfirmOptions {
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export const useDeleteConfirm = (options?: UseDeleteConfirmOptions) => {
  const [isOpen, setIsOpen] = useState(false)
  const [itemName, setItemName] = useState<string>('')
  const [isPending, setIsPending] = useState(false)
  const [pendingCallback, setPendingCallback] = useState<(() => void | Promise<void>) | null>(null)

  const openConfirm = useCallback((name: string, onConfirm?: () => void | Promise<void>) => {
    setItemName(name)
    setPendingCallback(() => onConfirm || options?.onConfirm || null)
    setIsOpen(true)
  }, [options])

  const closeConfirm = useCallback(() => {
    setIsOpen(false)
    setPendingCallback(null)
    options?.onCancel?.()
  }, [options])

  const handleConfirm = useCallback(async () => {
    if (!pendingCallback) return

    setIsPending(true)
    try {
      const result = pendingCallback()
      if (result instanceof Promise) {
        await result
      }
      setIsOpen(false)
      setPendingCallback(null)
    } finally {
      setIsPending(false)
    }
  }, [pendingCallback])

  return {
    isOpen,
    itemName,
    isPending,
    openConfirm,
    closeConfirm,
    handleConfirm,
  }
}
