import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { User, Mail, ShieldCheck, Clock } from 'lucide-react';

export function Profile() {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const profile = useProjectStore((state) => state.profile);

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text mb-2">Perfil de usuario</h2>
            <p className="text-text-secondary">Inicia sesión para ver tu perfil.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 max-w-md mx-auto">
          <Panel title="Perfil" padding="default">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue/20 text-blue flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-medium text-text">{user?.email ?? 'Usuario'}</h3>
                <p className="text-xs text-text-secondary">ID: {user?.id ?? '—'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded bg-panel/50 border border-text-secondary/10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green" />
                  <span className="text-sm text-text">Cuenta autenticada</span>
                </div>
                <span className="text-xs text-green">Activa</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-panel/50 border border-text-secondary/10">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm text-text">Correo electrónico</span>
                </div>
                <span className="text-xs text-text-secondary">{user?.email ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-panel/50 border border-text-secondary/10">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm text-text">Preferencias de accesibilidad</span>
                </div>
                <span className="text-xs text-text-secondary">Configuradas</span>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
