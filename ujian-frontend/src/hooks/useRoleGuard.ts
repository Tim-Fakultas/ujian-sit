import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

interface UseRoleGuardOptions {
  allowedRoles: string[];
  redirectTo?: string;
}

export function useRoleGuard({ allowedRoles, redirectTo = '/login' }: UseRoleGuardOptions) {
  const { user, isAuthenticated, hasRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // If user doesn't have required role, redirect based on their actual role
    const userHasAccess = allowedRoles.some(role => hasRole(role));
    
    if (!userHasAccess && user) {
      const userRole = user.roles && user.roles.length > 0 ? user.roles[0].name : null;
      
      // Redirect to appropriate dashboard
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'dosen') {
        router.push('/dosen/dashboard');
      } else if (userRole === 'mahasiswa') {
        router.push('/mahasiswa/dashboard');
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, isAuthenticated, hasRole, allowedRoles, redirectTo, router]);

  return {
    isAuthenticated: isAuthenticated(),
    hasAccess: allowedRoles.some(role => hasRole(role)),
    user,
  };
}