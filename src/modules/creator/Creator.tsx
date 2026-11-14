import * as React from 'react';
import * as THREE from 'three';
import { Scene3D } from '@/modules/three/Scene3D';
import { PropertiesPanel } from '@/modules/creator/PropertiesPanel';
import { HierarchyPanel } from '@/modules/creator/HierarchyPanel';
import { Toolbar } from '@/modules/creator/Toolbar';
import { useSceneStore } from '@/stores/sceneStore';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { createGeometry, createMaterial } from '@/utils/geometry';
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
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Pyramid,
  Maximize,
  Minimize,
  List,
  Settings,
  Globe,
  File,
} from 'lucide-react';
import type { GeometryType } from '@/types/index';

const GEOMETRIES: { type: GeometryType; label: string; Icon: React.ElementType }[] = [
  { type: 'cube', label: 'Cubo', Icon: Box },
  { type: 'sphere', label: 'Esfera', Icon: Circle },
  { type: 'cylinder', label: 'Cilindro', Icon: Cylinder },
  { type: 'cone', label: 'Cono', Icon: Cone },
  { type: 'plane', label: 'Plano', Icon: Maximize },
  { type: 'pyramid', label: 'Pirámide', Icon: Pyramid },
  { type: 'text', label: 'Texto 3D', Icon: Globe },
];

export function Creator() {
  const objects = useSceneStore((state) => state.objects);
  const selectedId = useSceneStore((state) => state.selectedId);
  const selected = objects.find((o) => o.id === selectedId);
  const addObject = useSceneStore((state) => state.addObject);
  const removeObject = useSceneStore((state) => state.removeObject);
  const duplicateObject = useSceneStore((state) => state.duplicateObject);
  const undo = useSceneStore((state) => state.undo);
  const redo = useSceneStore((state) => state.redo);
  const setObjectVisibility = useSceneStore((state) => state.setObjectVisibility);
  const setObjectLocked = useSceneStore((state) => state.setObjectLocked);
  const exportSceneJSON = useSceneStore((state) => state.exportSceneJSON);
  const importSceneJSON = useSceneStore((state) => state.importSceneJSON);
  const exportGLB = useSceneStore((state) => state.exportGLB);
  const importGLB = useSceneStore((state) => state.importGLB);
  const groupObjects = useSceneStore((state) => state.groupObjects);
  const ungroupObject = useSceneStore((state) => state.ungroupObject);
  const saveProject = useProjectStore((state) => state.saveProject);
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { announce } = useAccessibility();

  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [transformMode, setTransformMode] = React.useState<'translate' | 'rotate' | 'scale'>('translate');

  const handleAddGeometry = (type: GeometryType) => {
    const node = addObject(type);
    announce(`Se añadió ${node.name}`);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    removeObject(selectedId);
    announce('Objeto eliminado');
  };

  const handleDuplicate = () => {
    if (!selectedId) return;
    const node = duplicateObject(selectedId);
    if (node) announce(`Se duplicó ${node.name}`);
  };

  const handleExportJSON = () => {
    announce('Exportando escena a JSON...');
    const json = exportSceneJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'escena-3d-inclusive.json';
    a.click();
    URL.revokeObjectURL(url);
    announce('Escena exportada como JSON');
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const ok = importSceneJSON(text);
    if (ok) {
      announce('Escena importada correctamente');
    } else {
      announce('Error al importar la escena');
    }
    e.target.value = '';
  };

  const handleImportGLB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await importGLB(file);
    if (ok) {
      announce('Modelo GLB importado correctamente');
    } else {
      announce('Error al importar el modelo GLB');
    }
    e.target.value = '';
  };

  const handleExportGLB = async () => {
    announce('Exportando a GLB...');
    try {
      const tempScene = new THREE.Scene();
      objects.forEach((node) => {
        if (!node.visible) return;
        const geometry = createGeometry(node.type);
        const material = createMaterial(node.material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);
        mesh.rotation.set(node.transform.rotation.x, node.transform.rotation.y, node.transform.rotation.z);
        mesh.scale.set(node.transform.scale.x, node.transform.scale.y, node.transform.scale.z);
        tempScene.add(mesh);
      });
      await exportGLB(tempScene);
      announce('Escena exportada a GLB');
    } catch {
      announce('Error al exportar GLB');
    }
  };

  const handleGroup = () => {
    const selectedIds = objects.filter((o) => o.id === selectedId).map((o) => o.id);
    if (selectedIds.length < 2) {
      announce('Selecciona al menos 2 objetos para agrupar');
      return;
    }
    groupObjects(selectedIds, 'Grupo');
    announce('Objetos agrupados');
  };

  const handleUngroup = () => {
    if (!selectedId) return;
    ungroupObject(selectedId);
    announce('Grupo deshecho');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text">
      <Toolbar
        onAddGeometry={handleAddGeometry}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onUndo={undo}
        onRedo={redo}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportGLB={handleExportGLB}
        onImportGLB={handleImportGLB}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onSetTransformMode={setTransformMode}
        transformMode={transformMode}
      />
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-panel border-r border-text-secondary/10 flex flex-col">
          <HierarchyPanel objects={objects} selectedId={selectedId} />
        </aside>
        <main className="flex-1 relative min-w-0">
          <Scene3D
            className="w-full h-full"
            transformMode={transformMode}
            selectedId={selectedId}
            objects={objects}
          />
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start gap-4">
              <div className="text-sm font-mono text-text-secondary bg-panel/50 p-2 rounded border border-text-secondary/10">
                {selectedId ? `Seleccionado: ${selected?.name ?? '…'}` : 'Ningún objeto seleccionado'}
              </div>
              <div className="text-xs font-mono text-text-secondary">
                {objects.length} objetos
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => announce(`Modo: ${transformMode}`)}>
                {transformMode}
              </Button>
            </div>
          </div>
        </main>
        <aside className="w-96 bg-panel border-l border-text-secondary/10 flex flex-col">
          <PropertiesPanel selected={selected} />
        </aside>
      </div>
    </div>
  );
}
