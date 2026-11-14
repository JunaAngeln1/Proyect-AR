import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { File, Globe, Download, Trash2, Play } from 'lucide-react';

export function Library() {
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const removeProject = useProjectStore((state) => state.removeProject);
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const { announce } = useAccessibility();

  React.useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated, fetchProjects]);

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Biblioteca de Proyectos" padding="sm" className="z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <span className="text-xs text-text-secondary">Inicia sesión para ver tus proyectos guardados</span>
            )}
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={fetchProjects} title="Actualizar">
                <Globe className="w-4 h-4" /> Actualizar
              </Button>
            )}
          </div>
        </div>
      </Panel>

      <div className="flex-1 overflow-y-auto p-6">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-panel rounded-2xl border border-text-secondary/20 flex items-center justify-center mb-4">
              <File className="w-10 h-10 text-text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-text mb-2">Biblioteca vacía</h2>
            <p className="text-text-secondary max-w-xs mb-6">
              Inicia sesión para guardar y recuperar tus proyectos 3D en Supabase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                <Play className="w-12 h-12 text-text-secondary mb-3 opacity-30" />
                <p className="text-text-secondary">No hay proyectos aún. Crea uno en el Editor.</p>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-panel rounded-xl border border-text-secondary/20 p-4 hover:border-blue/50 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text truncate">{project.name}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(project.id);
                        announce('Proyecto eliminado');
                      }}
                      className="p-1 hover:bg-text-secondary/10 rounded text-text-secondary"
                      aria-label="Eliminar proyecto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">
                    {new Date(project.updated_at).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => announce(`Abriendo ${project.name}`)}>
                      <Play className="w-3 h-3 mr-1" /> Abrir
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => announce('Exportando proyecto')}>
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
