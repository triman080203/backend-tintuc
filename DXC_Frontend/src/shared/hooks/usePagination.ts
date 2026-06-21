import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

interface GetPaginationParamsResult {
  Current: number
  PageSize: number
}

export const usePagination = (defaultPageSize = 10, options?: UsePaginationOptions) => {
  const [page, setPage] = useState(options?.initialPage || 1)
  const [pageSize, setPageSize] = useState(options?.initialPageSize || defaultPageSize)

  const resetPage = useCallback(() => {
    setPage(1)
  }, [])

  const goToPage = useCallback((pageNum: number) => {
    setPage(Math.max(1, pageNum))
  }, [])

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when changing page size
  }, [])

  const getPaginationParams = useCallback((): GetPaginationParamsResult => {
    return {
      Current: page,
      PageSize: pageSize,
    }
  }, [page, pageSize])

  return {
    page,
    pageSize,
    setPage: goToPage,
    setPageSize: changePageSize,
    resetPage,
    getPaginationParams,
  }
}
