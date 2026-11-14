import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { List, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import type { Object3DNode } from '@/types/index';
import { useSceneStore } from '@/stores/sceneStore';

interface HierarchyPanelProps {
  objects: Object3DNode[];
  selectedId: string | null;
}

export function HierarchyPanel({ objects, selectedId }: HierarchyPanelProps) {
  const selectObject = useSceneStore((state) => state.selectObject);
  const setObjectVisibility = useSceneStore((state) => state.setObjectVisibility);
  const setObjectLocked = useSceneStore((state) => state.setObjectLocked);

  const roots = objects.filter((o) => !o.parentId);

  return (
    <Panel title="Jerarquía de objetos" padding="sm">
      <div className="flex items-center justify-between mb-2">
        <List className="w-4 h-4 text-text-secondary mr-2" />
        <span className="text-xs font-medium text-text">{objects.length} objetos</span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto space-y-1">
        {roots.map((node) => (
          <HierarchyItem
            key={node.id}
            node={node}
            all={objects}
            selectedId={selectedId}
            selectObject={selectObject}
            setObjectVisibility={setObjectVisibility}
            setObjectLocked={setObjectLocked}
          />
        ))}
        {roots.length === 0 && (
          <div className="text-center py-4 text-xs text-text-secondary">
            Sin objetos en la escena
          </div>
        )}
      </div>
    </Panel>
  );
}

function HierarchyItem({
  node,
  all,
  selectedId,
  selectObject,
  setObjectVisibility,
  setObjectLocked,
}: {
  node: Object3DNode;
  all: Object3DNode[];
  selectedId: string | null;
  selectObject: (id: string | null) => void;
  setObjectVisibility: (id: string, visible: boolean) => void;
  setObjectLocked: (id: string, locked: boolean) => void;
}) {
  const children = all.filter((o) => o.parentId === node.id);
  const isSelected = selectedId === node.id;

  return (
    <div
      className={[
        'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm transition',
        isSelected
          ? 'bg-blue/20 border border-blue/30 text-text'
          : 'hover:bg-text-secondary/10 text-text-secondary',
      ].join(' ')}
      role="button"
      tabIndex={0}
      onClick={() => selectObject(node.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectObject(node.id);
        }
      }}
      aria-label={node.name}
      aria-selected={isSelected}
    >
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span
          className="text-[10px] font-mono"
          title={node.name}
        >
          {node.name}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setObjectVisibility(node.id, !node.visible);
          }}
          aria-label={node.visible ? 'Ocultar' : 'Mostrar'}
          className="w-6 h-6 rounded hover:bg-text-secondary/10 flex items-center justify-center text-[10px]"
        >
          {node.visible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setObjectLocked(node.id, !node.locked);
          }}
          aria-label={node.locked ? 'Desbloquear' : 'Bloquear'}
          className="w-6 h-6 rounded hover:bg-text-secondary/10 flex items-center justify-center text-[10px]"
        >
          {node.locked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
        </button>
      </div>
      {children.length > 0 && (
        <div className="ml-6 mt-1 border-l border-text-secondary/10 pl-2 space-y-1">
          {children.map((child) => (
            <HierarchyItem
              key={child.id}
              node={child}
              all={all}
              selectedId={selectedId}
              selectObject={selectObject}
              setObjectVisibility={setObjectVisibility}
              setObjectLocked={setObjectLocked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
