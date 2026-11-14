import * as React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Menu, Sun, Moon, Search, User, Lock } from 'lucide-react';

interface TopbarProps {
  user: { email: string | null; id: string } | null;
  isAuthenticated: boolean;
}

export function Topbar({ user, isAuthenticated }: TopbarProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

  return (
    <header className="bg-panel border-b border-text-secondary/10 px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-text-secondary/10 text-text-secondary" aria-label="Menú">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green" />
          <span className="text-xs font-medium text-text">3D Inclusive Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Buscar modelos…"
            className="w-48 bg-bg border border-text-secondary/30 rounded pl-9 pr-3 py-1.5 text-xs text-text focus:ring-blue focus:outline-none placeholder-text-secondary/50"
            aria-label="Buscar modelos"
          />
          <Search className="absolute left-3 top-1/2 w-3 h-3 -translate-y-1/2 text-text-secondary/50" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded hover:bg-text-secondary/10 text-text-secondary"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-3 border-l border-text-secondary/20">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-text">{user?.email ?? 'Usuario'}</span>
              <span className="text-xs text-text-secondary">Sesión activa</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue/20 text-blue flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <Lock className="w-4 h-4 text-text-secondary" />
        )}
      </div>
    </header>
  );
}
