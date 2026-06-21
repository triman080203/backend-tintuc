import {
  Layout,
  Settings,
  Users,
  Shield,
  FileCheck,
  Building2,
  Building,
  Hotel,
  MapPin,
  UtensilsCrossed,
  Home,
  Leaf,
  Briefcase,
  Package,
  Phone,
  Image,
  Newspaper,
  Map,
  ShoppingCart,
  Ticket, MessageSquare, XCircle, CheckCircle, ArrowRightLeft, Clock
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItemConfig {
  id: string
  name: string
  href?: string
  icon?: LucideIcon
  roles?: string[] // empty array = public, undefined = admin only
  children?: NavItemConfig[]
  badge?: string | number
  external?: boolean
}

export interface NavGroup {
  id: string
  items: NavItemConfig[]
}

/**
 * Generate role code from menu name
 * Converts Vietnamese menu names to snake_case role codes
 * 
 * Examples:
 * "Xử lý phản ánh" → "xu_ly_phan_anh"
 * "Điều phối phản ánh" → "dieu_phoi_phan_anh"
 * "Phê duyệt phản ánh" → "phe_duyet_phan_anh"
 */
function generateRoleCodeFromMenuName(name: string): string {
  // Step 1: Remove Vietnamese diacritics
  const withoutDiacritics = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')

  // Step 2: Lowercase and replace spaces with underscore
  return withoutDiacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
}

/**
 * Calculate parent menu roles as union of all children roles
 * Always includes 'admin' role
 */
function calculateParentRoles(children?: NavItemConfig[]): string[] {
  const roles = new Set(['admin']) // Always include admin
  children?.forEach(child => {
    child.roles?.forEach(role => {
      if (role !== undefined) roles.add(role)
    })
  })
  return Array.from(roles)
}

/**
 * Navigation configuration with role-based access control
 * 
 * Roles are dynamically generated from menu names:
 * - 'admin': Has access to all menus
 * - Menu name → snake_case = role code
 *   - 'Điều phối phản ánh' → 'dieu_phoi_phan_anh'
 *   - 'Xử lý phản ánh' → 'xu_ly_phan_anh'
 *   - 'Phê duyệt phản ánh' → 'phe_duyet_phan_anh'
 */
const feedbackMenus: NavItemConfig[] = [
  {
    id: 'feedback-tracking',
    name: 'Theo dõi xử lý',
    href: '/feedback-tracking',
    icon: MessageSquare,
    roles: ['admin', generateRoleCodeFromMenuName('Theo dõi xử lý')],
  },
  {
    id: 'feedback-list',
    name: 'Điều phối phản ánh',
    href: '/feedback',
    icon: ArrowRightLeft,
    roles: ['admin', generateRoleCodeFromMenuName('Điều phối phản ánh')],
  },
  {
    id: 'feedback-processing',
    name: 'Xử lý phản ánh',
    href: '/feedback/processing',
    icon: Clock,
    roles: ['admin', generateRoleCodeFromMenuName('Xử lý phản ánh')],
  },
  {
    id: 'feedback-approval',
    name: 'Phê duyệt phản ánh',
    href: '/feedback/approval',
    icon: CheckCircle,
    roles: ['admin', generateRoleCodeFromMenuName('Phê duyệt phản ánh')],
  },
  {
    id: 'feedback-public',
    name: 'Phản ánh hoàn thành',
    href: '/feedback/public',
    icon: FileCheck,
    roles: ['admin', generateRoleCodeFromMenuName('Phản ánh hoàn thành')],
  },
  {
    id: 'feedback-rejected',
    name: 'Phản ánh từ chối',
    href: '/feedback/rejected',
    icon: XCircle,
    roles: ['admin', generateRoleCodeFromMenuName('Phản ánh từ chối')],
  },
]

const locationMenus: NavItemConfig[] = [
  {
    id: 'hotels',
    name: 'Quản lý khách sạn',
    href: '/hotels',
    icon: Hotel,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý khách sạn')],
  },
  {
    id: 'restaurants',
    name: 'Quản lý nhà hàng',
    href: '/restaurants',
    icon: UtensilsCrossed,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý nhà hàng')],
  },
  {
    id: 'homestays',
    name: 'Quản lý homestay',
    href: '/homestays',
    icon: Home,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý homestay')],
  },
]

const ocopMenus: NavItemConfig[] = [
  {
    id: 'ocop-categories',
    name: 'Quản lý danh mục OCOP',
    href: '/ocop-categories',
    icon: Leaf,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý danh mục OCOP')],
  },
  {
    id: 'ocop-enterprises',
    name: 'Quản lý doanh nghiệp OCOP',
    href: '/ocop-enterprises',
    icon: Briefcase,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý doanh nghiệp OCOP')],
  },
  {
    id: 'ocop-products',
    name: 'Quản lý sản phẩm OCOP',
    href: '/ocop-products',
    icon: Package,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý sản phẩm OCOP')],
  },
]

const hotlineMenus: NavItemConfig[] = [
  {
    id: 'hotline-categories',
    name: 'Quản lý danh mục Hotline',
    href: '/hotline-categories',
    icon: Phone,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý danh mục Hotline')],
  },
  {
    id: 'hotlines',
    name: 'Quản lý Hotline',
    href: '/hotlines',
    icon: Phone,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý Hotline')],
  },
]

// const iconMenus: NavItemConfig[] = [
//   {
//     id: 'icon-categories',
//     name: 'Quản lý danh mục icon',
//     href: '/icon-categories',
//     icon: Smile,
//     roles: ['admin', generateRoleCodeFromMenuName('Quản lý danh mục icon')],
//   },
//   {
//     id: 'icon-groups',
//     name: 'Quản lý nhóm icon',
//     href: '/icon-groups',
//     icon: Smile,
//     roles: ['admin', generateRoleCodeFromMenuName('Quản lý nhóm icon')],
//   },
//   {
//     id: 'icons',
//     name: 'Quản lý icon',
//     href: '/icons',
//     icon: Smile,
//     roles: ['admin', generateRoleCodeFromMenuName('Quản lý icon')],
//   },
// ]

const khaoSatMenus: NavItemConfig[] = [
  {
    id: 'khaosat-list',
    name: 'Danh sách khảo sát',
    href: '/khaosat',
    icon: FileCheck,
    roles: ['admin', generateRoleCodeFromMenuName('Danh sách khảo sát')],
  },
  {
    id: 'khaosat-statistics',
    name: 'Thống kê khảo sát',
    href: '/khaosat/statistics',
    icon: FileCheck,
    roles: ['admin', generateRoleCodeFromMenuName('Thống kê khảo sát')],
  },
]

// const supportGroupMenus: NavItemConfig[] = [
//   {
//     id: 'support-group-categories',
//     name: 'Quản lý danh mục nhóm hỗ trợ',
//     href: '/support-group-categories',
//     icon: Phone,
//     roles: ['admin', generateRoleCodeFromMenuName('Quản lý danh mục nhóm hỗ trợ')],
//   },
//   {
//     id: 'support-groups',
//     name: 'Nhóm hỗ trợ',
//     href: '/support-groups',
//     icon: Phone,
//     roles: ['admin', generateRoleCodeFromMenuName('Nhóm hỗ trợ')],
//   },
// ]

const newsMenus: NavItemConfig[] = [
  {
    id: 'news',
    name: 'Quản lý tin tức',
    href: '/news',
    icon: Newspaper,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý tin tức')],
  },
]

const bookingMenus: NavItemConfig[] = [
  {
    id: 'tours',
    name: 'Quản lý Tour',
    href: '/tours',
    icon: Map,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý Tour')],
  },
  {
    id: 'tickets',
    name: 'Quản lý Vé',
    href: '/tickets',
    icon: Ticket,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý Vé')],
  },
  {
    id: 'orders',
    name: 'Quản lý Đơn hàng',
    href: '/orders',
    icon: ShoppingCart,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý Đơn hàng')],
  },
]

const adminMenus: NavItemConfig[] = [
  {
    id: 'banners',
    name: 'Quản lý banner',
    href: '/banners',
    icon: Image,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý banner')],
  },
  {
    id: 'users',
    name: 'Quản lý người dùng',
    href: '/users',
    icon: Users,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý người dùng')],
  },
  // {
  //   id: 'total-users',
  //   name: 'Thống kê người dùng',
  //   href: '/total-users',
  //   icon: Users,
  //   roles: ['admin', generateRoleCodeFromMenuName('Thống kê người dùng')],
  // },
  {
    id: 'roles',
    name: 'Quản lý vai trò',
    href: '/roles',
    icon: Shield,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý vai trò')],
  },
  {
    id: 'organizations',
    name: 'Quản lý Đơn vị',
    href: '/organizations',
    icon: Building2,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý Đơn vị')],
  },
  {
    id: 'departments',
    name: 'Quản lý phòng ban',
    href: '/departments',
    icon: Building,
    roles: ['admin', generateRoleCodeFromMenuName('Quản lý phòng ban')],
  },
]

export const navigationConfig: NavItemConfig[] = [
  // Dashboard - Everyone
  {
    id: 'dashboard',
    name: 'Trang chủ',
    href: '/dashboard',
    icon: Layout,
    roles: [], // public
  },

  // Feedback Management - Role-based (parent roles auto-calculated)
  {
    id: 'feedback',
    name: 'Quản lý phản ánh',
    icon: MessageSquare,
    roles: calculateParentRoles(feedbackMenus),
    children: feedbackMenus,
  },

  // Booking Management - Admin only
  {
    id: 'booking-management',
    name: 'Quản lý Đặt Tour',
    icon: Map,
    roles: calculateParentRoles(bookingMenus),
    children: bookingMenus,
  },

  // News Management - Admin only
  {
    id: 'news-management',
    name: 'Quản lý tin tức',
    icon: Newspaper,
    roles: calculateParentRoles(newsMenus),
    children: newsMenus,
  },

  // Location Management - Admin only
  {
    id: 'location',
    name: 'Quản lý địa điểm',
    icon: MapPin,
    roles: calculateParentRoles(locationMenus),
    children: locationMenus,
  },

  // OCOP Management - Admin only
  {
    id: 'ocop',
    name: 'Quản lý OCOP',
    icon: Leaf,
    roles: calculateParentRoles(ocopMenus),
    children: ocopMenus,
  },

  // Hotline Management - Admin only
  {
    id: 'hotline',
    name: 'Quản lý Hotline',
    icon: Phone,
    roles: calculateParentRoles(hotlineMenus),
    children: hotlineMenus,
  },

  // Icon Management - Admin only
  // {
  //   id: 'icon',
  //   name: 'Quản lý icon động',
  //   icon: Smile,
  //   roles: calculateParentRoles(iconMenus),
  //   children: iconMenus,
  // },

  // Survey Management - Admin only
  {
    id: 'khaosat',
    name: 'Quản lý khảo sát',
    icon: FileCheck,
    roles: calculateParentRoles(khaoSatMenus),
    children: khaoSatMenus,
  },

  // Support Group Management - Admin only
  // {
  //   id: 'support-group',
  //   name: 'Quản lý nhóm hỗ trợ',
  //   icon: Phone,
  //   roles: calculateParentRoles(supportGroupMenus),
  //   children: supportGroupMenus,
  // },

  // Admin System Management - Admin only
  {
    id: 'admin',
    name: 'Quản trị hệ thống',
    icon: Settings,
    roles: calculateParentRoles(adminMenus),
    children: adminMenus,
  },
]

/**
 * Check if user can access a navigation item
 * 
 * Access rules:
 * - If roles is undefined: Admin only
 * - If roles is empty []: Everyone
 * - If roles has values: User must have at least one role
 */
export const canAccessNavItem = (
  item: NavItemConfig,
  userRoles: string[] | undefined,
  isAdmin: boolean
): boolean => {
  // Admin can access everything
  if (isAdmin) return true

  // If roles is undefined, admin only
  if (item.roles === undefined) return false

  // If roles is empty, everyone can access
  if (item.roles.length === 0) return true

  // Check if user has required role
  if (!userRoles || userRoles.length === 0) return false
  return userRoles.some(role => item.roles?.includes(role))
}

/**
 * Filter navigation items based on user roles
 */
export const filterNavigation = (
  navigation: NavItemConfig[],
  userRoles: string[] | undefined,
  isAdmin: boolean
): NavItemConfig[] => {
  return navigation
    .filter(item => canAccessNavItem(item, userRoles, isAdmin))
    .map(item => ({
      ...item,
      children: item.children
        ?.filter(child => canAccessNavItem(child, userRoles, isAdmin))
    }))
    .filter(item => !item.children || item.children.length > 0)
}

/**
 * Get flat list of all navigable routes (for matching)
 */
export const getAllNavigableRoutes = (): string[] => {
  const routes: string[] = []

  const traverse = (items: NavItemConfig[]) => {
    items.forEach(item => {
      if (item.href) routes.push(item.href)
      if (item.children) traverse(item.children)
    })
  }

  traverse(navigationConfig)
  return routes
}

/**
 * Find parent item for a given href
 */
export const findParentItem = (
  href: string,
  items: NavItemConfig[] = navigationConfig
): NavItemConfig | null => {
  for (const item of items) {
    if (item.children?.some(child => child.href === href)) {
      return item
    }
    if (item.children) {
      const found = findParentItem(href, item.children)
      if (found) return found
    }
  }
  return null
}

/**
 * Validate that all menu roles match the dynamic naming convention
 * Returns validation report for debugging
 */
export const validateMenuRoleMapping = (): { valid: boolean; issues: string[]; mappings: Record<string, string> } => {
  const issues: string[] = []
  const mappings: Record<string, string> = {}

  const traverse = (items: NavItemConfig[], path = '') => {
    items.forEach(item => {
      const itemPath = path ? `${path} > ${item.name}` : item.name

      if (item.children && item.children.length > 0) {
        traverse(item.children, itemPath)
      }

      // Skip dashboard (public) and admin system (hardcoded to admin-only)
      if (item.id === 'dashboard' || item.id === 'admin') return

      // Generate expected role code
      const expectedRoleCode = generateRoleCodeFromMenuName(item.name)
      mappings[item.name] = expectedRoleCode

      // Check if roles are correctly set
      if (item.roles && item.roles.length > 1) {
        const hasExpectedRole = item.roles.includes(expectedRoleCode)

        if (!hasExpectedRole) {
          issues.push(
            `❌ ${itemPath}: Expected role '${expectedRoleCode}' not found in ${JSON.stringify(item.roles)}`
          )
        }
      }
    })
  }

  traverse(navigationConfig)

  return {
    valid: issues.length === 0,
    issues,
    mappings,
  }
}
