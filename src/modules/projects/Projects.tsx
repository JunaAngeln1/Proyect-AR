import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/stores/projectStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Save, FolderPlus, Clock } from 'lucide-react';

export function Projects() {
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const saveProject = useProjectStore((state) => state.saveProject);
  const { scene } = useProjectStore((state) => ({ scene: null }));
  const { announce } = useAccessibility();

  const [name, setName] = React.useState('Nuevo proyecto');

  const handleSave = async () => {
    if (!name.trim()) return;
    const saved = await saveProject({
      name: name.trim(),
      thumbnail_url: null,
      scene: {
        objects: [],
        selectedId: null,
        cameraPosition: { x: 0, y: 4, z: 8 },
        cameraTarget: { x: 0, y: 0, z: 0 },
        gridSize: 20,
        gridDivisions: 40,
        showAxes: true,
        showGrid: true,
      },
      is_public: false,
    });
    if (saved) {
      announce(`Proyecto "${saved.name}" guardado`);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Proyectos" padding="sm" className="z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del proyecto"
              className="flex-1 bg-bg border border-text-secondary/30 rounded px-3 py-2 text-text focus:ring-blue focus:outline-none"
              aria-label="Nombre del proyecto"
            />
            <Button onClick={handleSave} disabled={!name.trim()}>
              <Save className="w-4 h-4 mr-2" /> Guardar
            </Button>
          </div>
          <div className="text-xs text-text-secondary">
            Los proyectos se guardan en Supabase con Row Level Security (privados por defecto).
          </div>
        </div>
      </Panel>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Tus proyectos</h2>
          <Button variant="outline" size="sm" onClick={() => announce('Nuevo proyecto')}>
            <FolderPlus className="w-4 h-4 mr-1" /> Nuevo
          </Button>
        </div>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-16 h-16 text-text-secondary mb-3 opacity-30" />
            <p className="text-text-secondary">Sin proyectos guardados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className={[
                  'flex items-center justify-between px-4 py-3 rounded border transition',
                  selectedProjectId === p.id
                    ? 'bg-blue/20 border-blue text-text'
                    : 'border-text-secondary/20 hover:bg-text-secondary/5 text-text-secondary',
                ].join(' ')}
                role="button"
                tabIndex={0}
                onClick={() => announce(`Proyecto ${p.name}`)}
              >
                <span className="text-sm">{p.name}</span>
                <span className="text-xs font-mono text-text-secondary">
                  {new Date(p.updated_at).toLocaleString('es-ES')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
