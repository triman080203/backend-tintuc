import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigation } from '../hooks/useNavigation'
import type { NavItemConfig } from '@/app/router/navigationConfig'

interface SidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onClose }) => {
  const {
    navigation,
    expandedItems,
    toggleExpanded,
    isActive,
    isParentActive,
  } = useNavigation()

  if (navigation.length === 0) {
    return null
  }

  const sidebarClasses = cn(
    'w-[280px] border-r border-gray-200 bg-white flex flex-col',
    isMobile && isOpen
      ? 'fixed left-0 top-16 bottom-0 z-30 h-auto shadow-lg animate-in slide-in-from-left-full duration-200'
      : isMobile && !isOpen
      ? 'fixed left-0 top-16 bottom-0 z-30 h-auto -translate-x-full'
      : 'sticky top-16 h-[calc(100vh-4rem)]'
  )

  return (
    <aside className={sidebarClasses}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50">
          <span className="text-sm font-semibold text-gray-900">Menu</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation.map(item => (
            <NavItemComponent
              key={item.id}
              item={item}
              level={0}
              isExpanded={expandedItems.has(item.id)}
              onToggle={() => toggleExpanded(item.id)}
              isActive={isActive}
              isParentActive={isParentActive}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

interface NavItemComponentProps {
  item: NavItemConfig
  level: number
  isExpanded: boolean
  onToggle: () => void
  isActive: (href: string | undefined) => boolean
  isParentActive: (item: NavItemConfig) => boolean
  expandedItems?: Set<string>
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({
  item,
  level,
  isExpanded,
  onToggle,
  isActive,
  isParentActive,
  expandedItems = new Set(),
}) => {
  const hasChildren = !!item.children?.length
  const active = item.href ? isActive(item.href) : isParentActive(item)
  const Icon = item.icon

  if (hasChildren) {
    return (
      <li key={item.id}>
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium',
            'transition-colors duration-150',
            'hover:bg-gray-50',
            active ? 'text-blue-700' : 'text-gray-700'
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && (
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                active ? 'text-blue-600' : 'text-gray-500'
              )} />
            )}
            <span className="truncate">{item.name}</span>
          </div>
          <div className={cn(
            'h-4 w-4 flex-shrink-0 transition-transform duration-200 text-gray-400',
            isExpanded && 'rotate-180'
          )}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </button>

        {/* Submenu with smooth animation */}
        {isExpanded && (
          <ul className="mt-1 ml-3 space-y-1 pl-3 border-l-2 border-gray-200">
            {item.children?.map(child => (
              <NavItemComponent
                key={child.id}
                item={child}
                level={level + 1}
                isExpanded={expandedItems.has(child.id)}
                onToggle={() => {/* Children don't toggle */}}
                isActive={isActive}
                isParentActive={isParentActive}
                expandedItems={expandedItems}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  // Leaf item (no children)
  return (
    <li key={item.id}>
      <Link
        to={item.href || '#'}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium relative',
          'transition-all duration-150',
          'hover:bg-gray-50',
          active 
            ? 'bg-blue-50 text-blue-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-600' 
            : 'text-gray-700'
        )}
      >
        {Icon && (
          <Icon className={cn(
            'h-5 w-5 flex-shrink-0',
            active ? 'text-blue-600' : 'text-gray-500'
          )} />
        )}
        <span className="truncate flex-1">{item.name}</span>
        {item.badge && (
          <span className="flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}
