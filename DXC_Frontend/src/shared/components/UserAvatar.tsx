import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  fullName?: string | null
  userName?: string | null
  avatarUrl?: string | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  fullName,
  userName,
  avatarUrl,
  className,
  size = 'md',
}) => {
  const getInitials = () => {
    const name = fullName || userName || 'U'
    const parts = name.trim().split(/\s+/)
    
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName || userName || 'User'} />}
      <AvatarFallback className="bg-blue-600 text-white font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  )
}
