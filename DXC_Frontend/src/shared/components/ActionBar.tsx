import React from 'react'
import { cn } from '@/lib/utils'

interface ActionBarProps {
  children: React.ReactNode
  className?: string
  isCompact?: boolean
}

/**
 * ActionBar Component
 * 
 * Provides consistent container styling for action buttons across the application.
 * - Manages border, rounded corners, shadow, and padding
 * - Ensures flex layout with consistent spacing
 * - Features define their own button styling, icon colors, and content
 * 
 * Usage:
 * <ActionBar>
 *   <Button...>Back</Button>
 *   <ActionBarDivider />
 *   <Button...>Save</Button>
 * </ActionBar>
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  children,
  className,
  isCompact = false,
}) => (
  <div className={cn(
    "border rounded-lg bg-card shadow-sm",
    isCompact ? "p-1" : "p-2",
    className
  )}>
    <div className="flex items-center gap-0">
      {children}
    </div>
  </div>
)

/**
 * ActionBarDivider Component
 * 
 * Visual separator between button groups in action bar
 * Usage: Place between different button groups for visual separation
 */
export const ActionBarDivider: React.FC = () => (
  <div className="text-muted-foreground mx-1">|</div>
)
