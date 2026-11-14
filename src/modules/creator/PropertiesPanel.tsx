import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import type { Object3DNode } from '@/types/index';
import { useSceneStore } from '@/stores/sceneStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface PropertiesPanelProps {
  selected: Object3DNode | undefined;
}

export function PropertiesPanel({ selected }: PropertiesPanelProps) {
  const setObjectVisibility = useSceneStore((state) => state.setObjectVisibility);
  const setObjectLocked = useSceneStore((state) => state.setObjectLocked);
  const updateTransform = useSceneStore((state) => state.updateTransform);
  const updateMaterial = useSceneStore((state) => state.updateMaterial);
  const setObjectName = useSceneStore((state) => state.setObjectName);
  const { containerClass } = useAccessibility();

  if (!selected) {
    return (
      <Panel title="Propiedades" padding="default">
        <div className="text-center py-10 text-text-secondary">
          Selecciona un objeto para editar sus propiedades
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Propiedades" padding="default" className={containerClass()}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Nombre
          </label>
          <input
            value={selected.name}
            onChange={(e) => setObjectName(selected.id, e.target.value)}
            className="w-full bg-bg border border-text-secondary/30 rounded px-3 py-2 text-text focus:ring-blue focus:outline-none"
            aria-label="Nombre del objeto"
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-xs font-medium text-text-secondary mb-1">
            Visible
            <span className="text-xs">{selected.visible ? 'Sí' : 'No'}</span>
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setObjectVisibility(selected.id, !selected.visible)}
            className="w-full justify-between"
            aria-label={selected.visible ? 'Ocultar objeto' : 'Mostrar objeto'}
          >
            {selected.visible ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Ocultar</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Mostrar</span>
              </>
            )}
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setObjectLocked(selected.id, !selected.locked)}
            className="w-full justify-between"
            aria-label={selected.locked ? 'Desbloquear objeto' : 'Bloquear objeto'}
          >
            {selected.locked ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Desbloquear</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Bloquear</span>
              </>
            )}
          </Button>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Color
          </label>
          <input
            type="color"
            defaultValue={`#${[
              Math.round(selected.material.color.r * 255)
                .toString(16)
                .padStart(2, '0'),
              Math.round(selected.material.color.g * 255)
                .toString(16)
                .padStart(2, '0'),
              Math.round(selected.material.color.b * 255)
                .toString(16)
                .padStart(2, '0'),
            ].join('')}`}
            onChange={(e) => {
              const hex = e.target.value.replace('#', '');
              const r = parseInt(hex.slice(0, 2), 16) / 255;
              const g = parseInt(hex.slice(2, 4), 16) / 255;
              const b = parseInt(hex.slice(4, 6), 16) / 255;
              updateMaterial(selected.id, { color: { r, g, b, hex } });
            }}
            className="w-full h-10 bg-transparent border-0 cursor-pointer"
            aria-label="Color del objeto"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-medium text-text-secondary">Metálico</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selected.material.metalness}
            onChange={(e) =>
              updateMaterial(selected.id, { metalness: parseFloat(e.target.value) })
            }
            className="w-full accent-blue"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-medium text-text-secondary">Rugosidad</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selected.material.roughness}
            onChange={(e) =>
              updateMaterial(selected.id, { roughness: parseFloat(e.target.value) })
            }
            className="w-full accent-purple"
          />
        </div>

        <div className="bg-panel/50 rounded p-3 border border-text-secondary/10">
          <h4 className="text-xs font-semibold text-text-secondary mb-2">
            Transformación
          </h4>
          <div className="space-y-2">
            {['position', 'rotation', 'scale'].map((key) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] text-text-secondary uppercase">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {['x', 'y', 'z'].map((axis) => (
                    <input
                      key={axis}
                      type="number"
                      step="0.1"
                      value={String((selected.transform as any)[key][axis])}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const t = selected.transform as any;
                        updateTransform(selected.id, {
                          [key]: { ...t[key], [axis]: val },
                        } as any);
                      }}
                      className="w-full bg-bg border border-text-secondary/30 rounded px-2 py-1 text-[11px] text-text focus:ring-blue focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
