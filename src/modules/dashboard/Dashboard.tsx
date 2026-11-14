import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  Box,
  Globe,
  Hand,
  ShieldCheck,
  Activity,
  User,
  LogOut,
  ArrowRight,
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));
  const projects = useProjectStore((state) => state.projects);
  const { announce } = useAccessibility();

  const cards = [
    {
      title: 'Editor 3D',
      desc: 'Crea y manipula objetos tridimensionales.',
      Icon: Box,
      to: '/creator',
    },
    {
      title: 'Visor 3D',
      desc: 'Visualiza modelos GLB de forma segura.',
      Icon: Globe,
      to: '/viewer',
    },
    {
      title: 'AR & Gestos',
      desc: 'Realidad aumentada y reconocimiento gestual.',
      Icon: Hand,
      to: '/ar',
    },
    {
      title: 'Accesibilidad',
      desc: 'Configuración WCAG 2.2 AA.',
      Icon: ShieldCheck,
      to: '/accessibility',
    },
  ];

  const handleLogout = async () => {
    await logout();
    announce('Sesión cerrada');
  };

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-panel rounded-2xl border border-text-secondary/20 flex items-center justify-center mb-6">
            <Box className="w-10 h-10 text-blue" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">3D Inclusive Studio</h1>
          <p className="text-text-secondary mb-8 max-w-md">
            Plataforma de modelado 3D accesible para estudiantes, docentes y personas con diferentes necesidades.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => { announce('Ir al creador'); navigate('/creator'); }}>
              Empezar a crear <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" onClick={() => { announce('Ir al visor'); navigate('/viewer'); }}>
              Visor 3D
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text">Panel de control</h1>
              <p className="text-text-secondary">Bienvenido, {user?.email ?? 'usuario'}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <Button
                key={c.title}
                variant="default"
                onClick={() => announce(`Ir a ${c.title}`)}
                className="w-full h-32 flex flex-col items-center gap-3 text-left p-5 hover:bg-text-secondary/10 transition group"
              >
                <div className="w-12 h-12 rounded bg-blue/20 text-blue flex items-center justify-center group-hover:scale-110 transition">
                  <c.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-text">{c.title}</h3>
                <p className="text-xs text-text-secondary">{c.desc}</p>
              </Button>
            ))}
          </div>

          <div className="bg-panel rounded-xl border border-text-secondary/20 p-6">
            <h3 className="font-medium text-text mb-4">Proyectos recientes</h3>
            {projects.length === 0 ? (
              <p className="text-text-secondary">No hay proyectos recientes. Crea uno en el editor.</p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded hover:bg-text-secondary/10 cursor-pointer">
                    <span className="text-sm text-text">{p.name}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(p.updated_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
