// src/api/request.ts (phiên bản đề xuất)
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios'

// Một interface chung để kiểm tra thuộc tính 'success'
interface ApiResponse {
  success: boolean
  message?: string
}

// 1. Tạo và cấu hình Axios instance
const axiosInstance = axios.create({
  baseURL: '/', // Sử dụng relative path để Vite proxy tự động chuyển tiếp đến backend
  timeout: 30000,
})

// 2. Interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  config => {
    // CHỈ lấy token từ sessionStorage để đảm bảo an toàn thông tin
    const token = sessionStorage.getItem('auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 3. Interceptor để xử lý các lỗi mạng và lỗi server (5xx, 4xx, ...)
axiosInstance.interceptors.response.use(
  response => response, // Bỏ qua nếu response thành công (status 2xx)
  (error: AxiosError) => {
    // Xử lý lỗi 401 Unauthorized - phiên đăng nhập hết hạn
    if (error.response?.status === 401) {
      // Xóa auth data từ sessionStorage
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
      
      // Điều hướng về trang đăng nhập (nếu không phải đang ở trang đăng nhập)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      
      return Promise.reject(error)
    }

    // Chỉ hiển thị thông báo lỗi cho lỗi mạng/server, không hiển thị cho lỗi logic từ API
    // Các lỗi logic sẽ được xử lý bởi component gọi API
    if (!error.response || error.response.status >= 500) {
      // Hiển thị thông báo lỗi chung cho lỗi mạng và lỗi server 5xx
      const message = `Lỗi API (${error.response?.status || 'Network Error'})`
      const description = error.message || 'Có lỗi xảy ra, vui lòng thử lại.'
      // Sử dụng console.error thay vì notification để tránh hiển thị trùng lặp
      console.error(message, description)
    }
    return Promise.reject(error)
  }
)

// 4. Hàm customRequest được Orval sử dụng, đã được nâng cấp
export const customRequest = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance
    .request({ ...config, headers: { 'Content-Type': 'application/json', ...config.headers } })
    .then((response: AxiosResponse<ApiResponse>) => {
      const result = response.data

      // Xử lý hợp đồng API: kiểm tra cờ 'success'
      if (result.success === false) {
        // Ném ra lỗi nếu API trả về success: false
        // Lỗi này sẽ được TanStack Query bắt và đưa vào trạng thái 'error'
        throw new Error(result.message || 'Có lỗi không xác định xảy ra từ API')
      }

      // Nếu thành công, trả về toàn bộ data.
      // ProTable cần toàn bộ object PagedResult, nên việc trả về cả object là an toàn nhất.
      return response.data as T
    })
}

export default axiosInstance
