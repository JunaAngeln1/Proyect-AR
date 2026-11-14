import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LogOut } from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Panel', icon: 'dashboard' },
  { to: '/creator', label: 'Creador 3D', icon: 'cube' },
  { to: '/viewer', label: 'Visor 3D', icon: 'globe' },
  { to: '/ar', label: 'AR & Gestos', icon: 'hand' },
  { to: '/library', label: 'Biblioteca', icon: 'file' },
  { to: '/projects', label: 'Proyectos', icon: 'folder' },
  { to: '/accessibility', label: 'Accesibilidad', icon: 'shield' },
  { to: '/profile', label: 'Perfil', icon: 'user' },
];

export function Sidebar() {
  const { logout, isAuthenticated } = useAuthStore((state) => ({
    logout: state.logout,
    isAuthenticated: state.isAuthenticated,
  }));
  const location = useLocation();

  return (
    <aside className="w-64 bg-panel border-r border-text-secondary/10 flex flex-col">
      <div className="p-5 flex items-center gap-3 border-b border-text-secondary/10">
        <div className="w-8 h-8 bg-blue rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 2 2-2h5a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="font-semibold text-text tracking-tight">3D Studio</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition',
                isActive
                  ? 'bg-blue/20 border border-blue text-text'
                  : 'text-text-secondary hover:bg-text-secondary/10',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="w-5 text-center text-text-secondary">{iconChar(item.icon)}</span>
              <span className={isActive ? 'font-medium text-text' : 'text-text-secondary'}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-text-secondary/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-red-300 hover:bg-red-500/10 transition"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

function iconChar(name: string): string {
  const map: Record<string, string> = {
    dashboard: '▢',
    cube: '⬡',
    globe: '⬢',
    hand: '✋',
    file: '📄',
    folder: '📁',
    shield: '🛡',
    user: '👤',
  };
  return map[name] || '•';
}
