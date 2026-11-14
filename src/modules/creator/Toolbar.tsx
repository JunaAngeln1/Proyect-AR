import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import type { GeometryType } from '@/types/index';
import {
  Plus,
  Box,
  Circle,
  Cylinder,
  Cone,
  Trash2,
  Copy,
  Save,
  Upload,
  Download,
  Undo,
  Redo,
  Eye,
  Lock,
  Palette,
  Pyramid,
  Maximize,
  Minimize,
  RotateCcw,
  Scale,
  Link,
  Unlink,
  File,
} from 'lucide-react';

interface ToolbarProps {
  onAddGeometry: (type: GeometryType) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportGLB: () => void;
  onImportGLB: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onSetTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  transformMode: 'translate' | 'rotate' | 'scale';
}

const GEOMETRIES: { type: GeometryType; label: string; Icon: React.ElementType }[] = [
  { type: 'cube', label: 'Cubo', Icon: Box },
  { type: 'sphere', label: 'Esfera', Icon: Circle },
  { type: 'cylinder', label: 'Cilindro', Icon: Cylinder },
  { type: 'cone', label: 'Cono', Icon: Cone },
  { type: 'plane', label: 'Plano', Icon: Maximize },
  { type: 'pyramid', label: 'Pirámide', Icon: Pyramid },
  { type: 'text', label: 'Texto 3D', Icon: File },
];

const MODE_ICONS: Record<'translate' | 'rotate' | 'scale', React.ElementType> = {
  translate: Maximize,
  rotate: RotateCcw,
  scale: Scale,
};

const MODE_LABELS: Record<'translate' | 'rotate' | 'scale', string> = {
  translate: 'Mover',
  rotate: 'Rotar',
  scale: 'Escalar',
};

export function Toolbar({
  onAddGeometry,
  onDelete,
  onDuplicate,
  onUndo,
  onRedo,
  onExportJSON,
  onImportJSON,
  onExportGLB,
  onImportGLB,
  onGroup,
  onUngroup,
  onSetTransformMode,
  transformMode,
}: ToolbarProps) {
  return (
    <Panel title="Editor 3D" padding="sm">
      <div className="flex flex-wrap gap-2">
        {/* Geometrías */}
        {GEOMETRIES.map((g) => (
          <Button
            key={g.type}
            variant="outline"
            size="icon"
            onClick={() => onAddGeometry(g.type)}
            title={`Añadir ${g.label}`}
            aria-label={`Añadir ${g.label}`}
          >
            <g.Icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="h-4 w-px bg-text-secondary/20 mx-1" />

        {/* Duplicar / Eliminar */}
        <Button variant="outline" size="icon" onClick={onDuplicate} title="Duplicar" aria-label="Duplicar objeto">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete} title="Eliminar" aria-label="Eliminar objeto">
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-text-secondary/20 mx-1" />

        {/* Deshacer / Rehacer */}
        <Button variant="outline" size="icon" onClick={onUndo} title="Deshacer" aria-label="Deshacer">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onRedo} title="Rehacer" aria-label="Rehacer">
          <Redo className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-text-secondary/20 mx-1" />

        {/* Modo de transformación */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-text-secondary uppercase">Transformar</span>
          {['translate', 'rotate', 'scale'].map((mode) => (
            <Button
              key={mode}
              variant={transformMode === mode ? 'default' : 'outline'}
              size="icon"
              onClick={() => onSetTransformMode(mode as 'translate' | 'rotate' | 'scale')}
              title={MODE_LABELS[mode as 'translate' | 'rotate' | 'scale']}
              aria-label={MODE_LABELS[mode as 'translate' | 'rotate' | 'scale']}
              className="h-8 w-8"
            >
              {mode === 'translate' && <Maximize className="w-4 h-4" />}
              {mode === 'rotate' && <RotateCcw className="w-4 h-4" />}
              {mode === 'scale' && <Scale className="w-4 h-4" />}
            </Button>
          ))}
        </div>
        <div className="h-4 w-px bg-text-secondary/20 mx-1" />

        {/* Agrupar / Desagrupar */}
        <Button variant="outline" size="icon" onClick={onGroup} title="Agrupar" aria-label="Agrupar objetos">
          <Link className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onUngroup} title="Desagrupar" aria-label="Desagrupar objetos">
          <Unlink className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-text-secondary/20 mx-1" />

        {/* Exportar / Importar */}
        <Button variant="outline" size="icon" onClick={onExportJSON} title="Exportar JSON" aria-label="Exportar escena JSON">
          <Download className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-xs text-text-secondary p-1">
            Importar JSON
            <input
              type="file"
              accept=".json"
              className="sr-only"
              onChange={onImportJSON}
              aria-label="Importar escena JSON"
            />
            <Upload className="w-4 h-4" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-xs text-text-secondary p-1">
            Importar GLB
            <input
              type="file"
              accept=".glb,.gltf"
              className="sr-only"
              onChange={onImportGLB}
              aria-label="Importar modelo GLB"
            />
            <Download className="w-4 h-4" />
          </label>
        </div>
        <Button variant="outline" size="icon" onClick={onExportGLB} title="Exportar GLB" aria-label="Exportar escena GLB">
          <File className="w-4 h-4" />
        </Button>
      </div>
    </Panel>
  );
}
