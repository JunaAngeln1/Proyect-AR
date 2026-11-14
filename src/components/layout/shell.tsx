import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useAuthStore } from '@/stores/authStore';
import { useAccessibility } from '@/hooks/useAccessibility';

export function Shell({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const { containerClass } = useAccessibility();

  const hideSidebar = ['/login', '/dashboard'].includes(location.pathname);

  return (
    <div className={['flex h-screen bg-bg text-text', containerClass].filter(Boolean).join(' ')}>
      {!hideSidebar && isAuthenticated && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} isAuthenticated={isAuthenticated} />
        <main className="flex-1 overflow-y-auto bg-bg">{children}</main>
      </div>
    </div>
  );
}
