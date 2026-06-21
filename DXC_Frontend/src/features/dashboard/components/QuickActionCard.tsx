import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: string
  label: string
  href: string
  icon: LucideIcon
  iconColor?: string
  visible?: boolean
}

interface QuickActionCardProps {
  title: string
  actions: QuickAction[]
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  actions,
}) => {
  const visibleActions = actions.filter(action => action.visible !== false)

  if (visibleActions.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-1">
        {visibleActions.map(action => (
          <Link
            key={action.id}
            to={action.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <action.icon
                className={cn(
                  'h-5 w-5',
                  action.iconColor || 'text-blue-600'
                )}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {action.label}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </Link>
        ))}
      </div>
    </Card>
  )
}
