import * as THREE from 'three';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  SceneState,
  Object3DNode,
  TransformProps,
  MaterialProps,
  GeometryType,
  HistoryEntry,
} from '@/types/index';
import { DEFAULT_SCENE, DEFAULT_MATERIAL, DEFAULT_TRANSFORM, GEOMETRY_LABELS } from '@/lib/constants';

function newObjectId(): string {
  return `obj_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export interface SceneActions {
  // Objetos
  addObject: (
    type: GeometryType,
    name?: string,
    material?: MaterialProps,
  ) => Object3DNode;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => Object3DNode | null;
  selectObject: (id: string | null) => void;
  updateTransform: (id: string, transform: Partial<TransformProps>) => void;
  updateMaterial: (id: string, material: Partial<MaterialProps>) => void;
  setObjectVisibility: (id: string, visible: boolean) => void;
  setObjectLocked: (id: string, locked: boolean) => void;
  setObjectName: (id: string, name: string) => void;
  setParent: (id: string, parentId: string | null) => void;
  groupObjects: (ids: string[], name?: string) => void;
  ungroupObject: (groupId: string) => void;
  exportGLB: (scene: THREE.Scene) => Promise<void>;
  importGLB: (file: File) => Promise<boolean>;

  // Escena / cámara
  setCameraPosition: (pos: { x: number; y: number; z: number }) => void;
  setCameraTarget: (pos: { x: number; y: number; z: number }) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  setGridSize: (size: number) => void;
  resetScene: () => void;

  // Deshacer / rehacer
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // Importar / exportar JSON
  loadScene: (scene: SceneState) => void;
  exportSceneJSON: () => string;
  importSceneJSON: (json: string) => boolean;
}

type SceneStore = SceneState & SceneActions & {
  history: HistoryEntry[];
  historyIndex: number;
  maxHistory: number;
};

const clampHistory = (index: number, max: number) =>
  clamp(index, 0, max - 1);

export const useSceneStore = create<SceneStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SCENE,
      history: [
        {
          scene: { ...DEFAULT_SCENE },
          timestamp: new Date().toISOString(),
        },
      ],
      historyIndex: 0,
      maxHistory: 50,

      addObject: (type, name, material) => {
        const id = newObjectId();
        const now = new Date().toISOString();
        const node: Object3DNode = {
          id,
          name: name || GEOMETRY_LABELS[type],
          type,
          parentId: null,
          transform: { ...DEFAULT_TRANSFORM },
          material: material ? { ...material } : { ...DEFAULT_MATERIAL },
          visible: true,
          locked: false,
          castShadow: true,
          receiveShadow: true,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => {
          const objects = [...state.objects, node];
          return {
            objects,
            selectedId: id,
            history: pushHistoryEntry(state, { ...state, objects }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
        return node;
      },

      removeObject: (id) => {
        set((state) => {
          const objects = state.objects.filter((o) => o.id !== id);
          // reasignar hijos huérfanos a raíz
          const fixed = objects.map((o) =>
            o.parentId === id ? { ...o, parentId: null } : o,
          );
          return {
            objects: fixed,
            selectedId: state.selectedId === id ? null : state.selectedId,
            history: pushHistoryEntry(state, { ...state, objects: fixed }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
      },

      duplicateObject: (id) => {
        const source = get().objects.find((o) => o.id === id);
        if (!source) return null;
        const now = new Date().toISOString();
        const clone: Object3DNode = {
          ...source,
          id: newObjectId(),
          name: `${source.name} (copia)`,
          transform: {
            ...source.transform,
            position: {
              x: source.transform.position.x + 1,
              y: source.transform.position.y,
              z: source.transform.position.z,
            },
          },
          createdAt: now,
          updatedAt: now,
        };
        set((state) => {
          const objects = [...state.objects, clone];
          return {
            objects,
            selectedId: clone.id,
            history: pushHistoryEntry(state, { ...state, objects }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
        return clone;
      },

      selectObject: (id) => {
        set({ selectedId: id });
      },

      updateTransform: (id, transform) => {
        set((state) => {
          const objects = state.objects.map((o) =>
            o.id === id && !o.locked
              ? {
                  ...o,
                  transform: { ...o.transform, ...transform },
                  updatedAt: new Date().toISOString(),
                }
              : o,
          );
          return {
            objects,
            history: pushHistoryEntry(state, { ...state, objects }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
      },

      updateMaterial: (id, material) => {
        set((state) => {
          const objects = state.objects.map((o) =>
            o.id === id && !o.locked
              ? {
                  ...o,
                  material: { ...o.material, ...material },
                  updatedAt: new Date().toISOString(),
                }
              : o,
          );
          return {
            objects,
            history: pushHistoryEntry(state, { ...state, objects }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
      },

      setObjectVisibility: (id, visible) => {
        set((state) => {
          const objects = state.objects.map((o) =>
            o.id === id ? { ...o, visible } : o,
          );
          return {
            objects,
            history: pushHistoryEntry(state, { ...state, objects }),
            historyIndex: clampHistory(
              (state.historyIndex ?? -1) + 1,
              state.maxHistory,
            ),
          };
        });
      },

      setObjectLocked: (id, locked) => {
        set((state) => {
          const objects = state.objects.map((o) =>
            o.id === id ? { ...o, locked } : o,
          );
          return { objects };
        });
      },

      setObjectName: (id, name) => {
        set((state) => ({
          objects: state.objects.map((o) =>
            o.id === id ? { ...o, name } : o,
          ),
        }));
      },

      setParent: (id, parentId) => {
        set((state) => ({
          objects: state.objects.map((o) =>
            o.id === id ? { ...o, parentId } : o,
          ),
        }));
      },

      setCameraPosition: (pos) => {
        set({ cameraPosition: pos });
      },

      setCameraTarget: (pos) => {
        set({ cameraTarget: pos });
      },

      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
      setGridSize: (size) => set({ gridSize: size }),

      resetScene: () => {
        set({ ...DEFAULT_SCENE, history: [], historyIndex: -1 });
      },

      pushHistory: () => {
        set((state) => ({
          history: pushHistoryEntry(state, state),
          historyIndex: clampHistory(
            (state.historyIndex ?? -1) + 1,
            state.maxHistory,
          ),
        }));
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;
        const next = history[historyIndex - 1];
        set({
          objects: next.scene.objects,
          selectedId: next.scene.selectedId,
          cameraPosition: next.scene.cameraPosition,
          cameraTarget: next.scene.cameraTarget,
          gridSize: next.scene.gridSize,
          gridDivisions: next.scene.gridDivisions,
          showAxes: next.scene.showAxes,
          showGrid: next.scene.showGrid,
          historyIndex: historyIndex - 1,
        });
      },

      redo: () => {
        const { history, historyIndex, maxHistory } = get();
        if (historyIndex >= history.length - 1) return;
        const next = history[historyIndex + 1];
        set({
          objects: next.scene.objects,
          selectedId: next.scene.selectedId,
          cameraPosition: next.scene.cameraPosition,
          cameraTarget: next.scene.cameraTarget,
          gridSize: next.scene.gridSize,
          gridDivisions: next.scene.gridDivisions,
          showAxes: next.scene.showAxes,
          showGrid: next.scene.showGrid,
          historyIndex: clampHistory(historyIndex + 1, maxHistory),
        });
      },

      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },

      loadScene: (scene) => {
        set({
          ...scene,
          history: [],
          historyIndex: -1,
        });
      },

      exportSceneJSON: () => {
        const state = get();
        return JSON.stringify(
          {
            objects: state.objects,
            selectedId: state.selectedId,
            cameraPosition: state.cameraPosition,
            cameraTarget: state.cameraTarget,
            gridSize: state.gridSize,
            gridDivisions: state.gridDivisions,
            showAxes: state.showAxes,
            showGrid: state.showGrid,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      },

      importSceneJSON: (json) => {
        try {
          const parsed = JSON.parse(json);
          const scene: SceneState = {
            objects: parsed.objects ?? [],
            selectedId: parsed.selectedId ?? null,
            cameraPosition: parsed.cameraPosition ?? DEFAULT_SCENE.cameraPosition,
            cameraTarget: parsed.cameraTarget ?? DEFAULT_SCENE.cameraTarget,
            gridSize: parsed.gridSize ?? DEFAULT_SCENE.gridSize,
            gridDivisions: parsed.gridDivisions ?? DEFAULT_SCENE.gridDivisions,
            showAxes: parsed.showAxes ?? DEFAULT_SCENE.showAxes,
            showGrid: parsed.showGrid ?? DEFAULT_SCENE.showGrid,
          };
          get().loadScene(scene);
          return true;
        } catch {
          return false;
        }
      },

      groupObjects: (ids, name) => {
        const objects = get().objects;
        const selected = ids.map((id) => objects.find((o) => o.id === id)).filter(Boolean);
        if (selected.length < 2) return;
        const now = new Date().toISOString();
        const groupId = newObjectId();
        const groupNode: Object3DNode = {
          id: groupId,
          name: name || 'Grupo',
          type: 'cube',
          parentId: null,
          transform: DEFAULT_TRANSFORM,
          material: { ...DEFAULT_MATERIAL },
          visible: true,
          locked: false,
          castShadow: false,
          receiveShadow: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          objects: [
            ...state.objects.filter((o) => !ids.includes(o.id)),
            groupNode,
            ...selected.map((o) => ({ ...o!, id: newObjectId(), parentId: groupId })),
          ],
        }));
      },

      ungroupObject: (groupId) => {
        const objects = get().objects;
        const children = objects.filter((o) => o.parentId === groupId);
        set((state) => ({
          objects: [
            ...state.objects.filter((o) => o.id !== groupId && o.parentId !== groupId),
            ...children.map((o) => ({ ...o, id: newObjectId(), parentId: null })),
          ],
        }));
      },

      exportGLB: async (scene) => {
        const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
        return new Promise<void>((resolve, reject) => {
          const exporter = new GLTFExporter();
          exporter.parse(
            scene,
            (gltf) => {
              const blob = new Blob([gltf as BlobPart], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'modelo-3d-inclusive.glb';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              resolve();
            },
            (error) => reject(error),
            { binary: true },
          );
        });
      },

      importGLB: async (file) => {
        try {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const loader = new GLTFLoader();
          const url = URL.createObjectURL(file);
          const gltf = await loader.loadAsync(url);
          const now = new Date().toISOString();
          const nodes: Object3DNode[] = [];
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const id = newObjectId();
              nodes.push({
                id,
                name: child.name || 'Objeto importado',
                type: 'cube',
                parentId: null,
                transform: {
                  position: { x: child.position.x, y: child.position.y, z: child.position.z },
                  rotation: { x: child.rotation.x, y: child.rotation.y, z: child.rotation.z },
                  scale: { x: child.scale.x, y: child.scale.y, z: child.scale.z },
                },
                material: {
                  color: { r: 0.5, g: 0.7, b: 1, hex: '#7FABFF' },
                  metalness: 0.2,
                  roughness: 0.6,
                  opacity: 1,
                  transparent: false,
                },
                visible: true,
                locked: false,
                castShadow: true,
                receiveShadow: true,
                createdAt: now,
                updatedAt: now,
              });
            }
          });
          set((state) => ({
            objects: [...state.objects, ...nodes],
            selectedId: nodes[0]?.id ?? null,
          }));
          URL.revokeObjectURL(url);
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'scene-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        objects: state.objects,
        selectedId: state.selectedId,
        cameraPosition: state.cameraPosition,
        cameraTarget: state.cameraTarget,
        gridSize: state.gridSize,
        gridDivisions: state.gridDivisions,
        showAxes: state.showAxes,
        showGrid: state.showGrid,
      }),
    },
  ),
);

function pushHistoryEntry(
  state: SceneStore,
  next: SceneStore,
): HistoryEntry[] {
  const entry: HistoryEntry = {
    scene: {
      objects: next.objects,
      selectedId: next.selectedId,
      cameraPosition: next.cameraPosition,
      cameraTarget: next.cameraTarget,
      gridSize: next.gridSize,
      gridDivisions: next.gridDivisions,
      showAxes: next.showAxes,
      showGrid: next.showGrid,
    },
    timestamp: new Date().toISOString(),
  };
  const newHistory = [...state.history, entry];
  // recortar si se pasa del máximo (mantener los últimos)
  if (newHistory.length > state.maxHistory) {
    return newHistory.slice(newHistory.length - state.maxHistory);
  }
  return newHistory;
}
