import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { queryClient } from '@/api/queryClient'

interface User {
  publicId?: string | null
  fullName: string | null
  userName: string | null
  email: string | null
  createdAt?: string
  roleCodes?: string[] | null
  departmentPublicId?: string | null
  departmentName?: string | null
  organizationPublicId?: string | null
  organizationName?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext, useAuth }

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch current user info from API (only when token exists)
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser()

  // Initialize auth state from sessionStorage and sync with server
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = sessionStorage.getItem('auth_token')
        const storedUser = sessionStorage.getItem('auth_user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        // Clear invalid data
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Sync user data from API (useCurrentUser hook)
  useEffect(() => {
    // Only sync if we have auth token, current user data, and not loading
    if (currentUserData && token && !userLoading) {
      setUser(prevUser => {
        // Merge API data with existing user data (API data takes precedence)
        const updatedUser = {
          ...prevUser,
          ...currentUserData,
        }
        // Update sessionStorage with latest user info
        sessionStorage.setItem('auth_user', JSON.stringify(updatedUser))
        return updatedUser
      })
    }
  }, [currentUserData, token, userLoading])

  // Only consider auth fully loaded when both initial state and user data are ready
  const isAuthReady = !isLoading && (!token || !userLoading)

  const login = (newToken: string, newUser: User) => {
    // CHỈ lưu vào sessionStorage để đảm bảo an toàn thông tin
    // Token sẽ bị xóa khi đóng tab/browser
    sessionStorage.setItem('auth_token', newToken)
    sessionStorage.setItem('auth_user', JSON.stringify(newUser))

    // Set state sau khi đã lưu vào storage
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    // 1. Xóa TanStack Query cache để tránh dữ liệu cũ khi chuyển user
    queryClient.clear()

    // 2. Xóa auth state
    setToken(null)
    setUser(null)

    // 3. Xóa khỏi sessionStorage
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: !isAuthReady,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}