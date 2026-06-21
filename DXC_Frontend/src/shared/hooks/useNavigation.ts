import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import {
  filterNavigation,
  findParentItem,
  navigationConfig,
  type NavItemConfig,
} from '@/app/router/navigationConfig'

/**
 * Helper function to check if a path matches a route (used for parent detection)
 */
const isPathMatchingRoute = (currentPath: string, href: string | undefined): boolean => {
  if (!href) return false
  
  // Exact match
  if (currentPath === href) return true
  
  // Parent match (detail/edit pages only)
  if (currentPath.startsWith(href + '/')) {
    const remainder = currentPath.slice((href + '/').length)
    const firstSegment = remainder.split('/')[0]
    
    // Known feature-specific routes that should not match parent
    const featureRoutes = new Set([
      'processing', 'approval', 'public', 'rejected', 'create', 'edit',
      'import', 'export', 'filter', 'search', 'settings', 'config'
    ])
    
    // If first segment is a feature route name, don't match parent
    if (featureRoutes.has(firstSegment)) return false
    
    // If it looks like an ID, match parent (for detail/edit pages)
    // UUID pattern: 8-4-4-4-12 hex digits
    const isUuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(firstSegment)
    if (isUuid) return true
    
    // Numeric IDs or slugs with dashes (but not pure text)
    const isId = /^(\d+|[a-zA-Z0-9]+-[a-zA-Z0-9-]*)$/.test(firstSegment)
    if (isId) return true
  }
  
  return false
}

export const useNavigation = () => {
  const location = useLocation()
  const { user } = useAuth()
  
  // Helper to collect all parent item IDs (items with children)
  const getInitialExpandedItems = (items: NavItemConfig[]): Set<string> => {
    const allIds = new Set<string>()
    const collect = (navItems: NavItemConfig[]) => {
      navItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id)
          collect(item.children)
        }
      })
    }
    collect(items)
    return allIds
  }

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const isAdmin = user?.roleCodes?.includes('admin') || false
    const filteredNav = filterNavigation(navigationConfig, user?.roleCodes || undefined, isAdmin)
    return getInitialExpandedItems(filteredNav)
  })

  // Filter navigation based on user roles
  const filteredNav = useMemo(() => {
    const isAdmin = user?.roleCodes?.includes('admin') || false
    return filterNavigation(navigationConfig, user?.roleCodes || undefined, isAdmin)
  }, [user?.roleCodes])

  // Auto-expand parent menu when navigating to child route
  useEffect(() => {
    const currentPath = location.pathname
    
    // Find parent item for current path
    // First, try exact match (for detail routes defined in nav)
    let parent = findParentItem(currentPath, filteredNav)
    
    // If no exact match, find parent by checking if current path matches any child route
    // IMPORTANT: Sort by href length DESC to prioritize specific routes over generic ones
    if (!parent) {
      for (const item of filteredNav) {
        // Sort children by href length (longest first) to prioritize specific routes
        const sortedChildren = [...(item.children || [])].sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0))
        
        const bestMatch = sortedChildren.find(child => {
          return isPathMatchingRoute(currentPath, child.href)
        })
        
        if (bestMatch) {
          parent = item
          break
        }
      }
    }
    
    if (parent?.id && !expandedItems.has(parent.id)) {
      setExpandedItems(prev => new Set([...prev, parent.id]))
    }
  }, [location.pathname, filteredNav, expandedItems])

  // Check if a route is currently active
  const isActive = (href: string | undefined): boolean => {
    return isPathMatchingRoute(location.pathname, href)
  }

  // Check if parent menu is active (any child is active)
  const isParentActive = (item: NavItemConfig): boolean => {
    if (!item.children) return false
    return item.children.some(child => isActive(child.href))
  }

  // Toggle expanded state
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }



  return {
    navigation: filteredNav,
    expandedItems,
    toggleExpanded,
    isActive,
    isParentActive,
    currentPath: location.pathname,
  }
}
