import { useAuthStore } from '@/stores/auth'

/**
 * Check if current user is a super admin
 */
export function isSuperAdmin(): boolean {
  const authStore = useAuthStore()
  return authStore.user?.userType === 'super_admin'
}

/**
 * Check if current user is an admin (including super admin)
 */
export function isAdmin(): boolean {
  const authStore = useAuthStore()
  const userType = authStore.user?.userType
  return userType === 'super_admin' || userType === 'admin'
}

/**
 * Check if current user is a client
 */
export function isClient(): boolean {
  const authStore = useAuthStore()
  return authStore.user?.userType === 'client'
}

/**
 * Check if user has admin access (super admin only)
 */
export function hasAdminAccess(): boolean {
  return isSuperAdmin()
}

/**
 * Check if user has school management access (admin and super admin)
 */
export function hasSchoolManagementAccess(): boolean {
  return isAdmin()
}

/**
 * Get user type display name
 */
export function getUserTypeDisplay(userType: string): string {
  switch (userType) {
    case 'super_admin':
      return 'Super Administrator'
    case 'admin':
      return 'Administrator'
    case 'client':
      return 'Client'
    default:
      return 'Unknown'
  }
}

/**
 * Check if user can access admin routes
 */
export function canAccessAdminRoutes(): boolean {
  return hasAdminAccess()
}

/**
 * Check if user can access school management
 */
export function canAccessSchoolManagement(): boolean {
  return hasSchoolManagementAccess()
} 