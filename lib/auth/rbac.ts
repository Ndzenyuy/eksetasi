import { getSession } from './session';
import { NextResponse } from 'next/server';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface RolePermissions {
  canManageUsers: boolean;
  canManageQuestions: boolean;
  canManageExams: boolean;
  canViewAnalytics: boolean;
  canDeleteContent: boolean;
  canModerateContent: boolean;
}

// Define permissions for each role
export const rolePermissions: Record<UserRole, RolePermissions> = {
  ADMIN: {
    canManageUsers: true,
    canManageQuestions: true,
    canManageExams: true,
    canViewAnalytics: true,
    canDeleteContent: true,
    canModerateContent: true,
  },
  TEACHER: {
    canManageUsers: false,
    canManageQuestions: true,
    canManageExams: true,
    canViewAnalytics: true,
    canDeleteContent: false, // Can only delete their own content
    canModerateContent: false,
  },
  STUDENT: {
    canManageUsers: false,
    canManageQuestions: false,
    canManageExams: false,
    canViewAnalytics: false,
    canDeleteContent: false,
    canModerateContent: false,
  },
};

// Check if user has specific permission
export function hasPermission(userRole: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[userRole][permission];
}

// Check if user can access admin panel
export function canAccessAdmin(userRole: UserRole): boolean {
  return userRole === 'ADMIN' || userRole === 'TEACHER';
}

// Middleware function to check admin access
export async function requireAdminAccess() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  const userRole = session.role as UserRole;
  
  if (!canAccessAdmin(userRole)) {
    return NextResponse.json(
      { message: 'Admin access required. You must be an admin or teacher.' },
      { status: 403 }
    );
  }

  return null; // No error, access granted
}

// Middleware function to check specific permission
export async function requirePermission(permission: keyof RolePermissions) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  const userRole = session.role as UserRole;
  
  if (!hasPermission(userRole, permission)) {
    return NextResponse.json(
      { message: `Permission denied. Required permission: ${permission}` },
      { status: 403 }
    );
  }

  return null; // No error, access granted
}

// Get user permissions
export async function getUserPermissions(): Promise<RolePermissions | null> {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const userRole = session.role as UserRole;
  return rolePermissions[userRole];
}

// Check if user owns content (for teachers to manage their own content)
export function canManageContent(userRole: UserRole, contentCreatorId: string, currentUserId: string): boolean {
  // Admins can manage all content
  if (userRole === 'ADMIN') {
    return true;
  }
  
  // Teachers can manage their own content
  if (userRole === 'TEACHER' && contentCreatorId === currentUserId) {
    return true;
  }
  
  return false;
}

// Role hierarchy for user management
export function canManageUserRole(managerRole: UserRole, targetRole: UserRole): boolean {
  // Only admins can manage users
  if (managerRole !== 'ADMIN') {
    return false;
  }
  
  // Admins can manage all roles
  return true;
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'TEACHER':
      return 'Teacher';
    case 'STUDENT':
      return 'Student';
    default:
      return 'Unknown';
  }
}

// Get role color for UI
export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800';
    case 'TEACHER':
      return 'bg-blue-100 text-blue-800';
    case 'STUDENT':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
