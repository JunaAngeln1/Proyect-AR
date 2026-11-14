import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from '@/components/layout/shell';
import { Dashboard } from '@/modules/dashboard/Dashboard';
import { Creator } from '@/modules/creator/Creator';
import { Viewer } from '@/modules/viewer/Viewer';
import { ARViewer } from '@/modules/ar/ARViewer';
import { GestureLab } from '@/modules/gestures/GestureLab';
import { Library } from '@/modules/library/Library';
import { Projects } from '@/modules/projects/Projects';
import { AccessibilitySettings } from '@/modules/accessibility/AccessibilitySettings';
import { Profile } from '@/modules/profile/Profile';
import { useAuthStore } from '@/stores/authStore';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/creator" element={<Creator />} />
      <Route path="/viewer" element={<Viewer />} />
      <Route path="/ar" element={<ARViewer />} />
      <Route path="/gestures" element={<GestureLab />} />
      <Route path="/library" element={<Library />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/accessibility" element={<AccessibilitySettings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Shell>
        <AppRoutes />
      </Shell>
    </BrowserRouter>
  );
}
