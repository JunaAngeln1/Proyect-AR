import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/sceneStore';
import {
  createObjectNode,
  createGeometry,
  createMaterial,
  applyTransformToMesh,
  extractTransformFromMesh,
  updateMaterial,
} from '@/utils/geometry';
import { DEFAULT_MATERIAL } from '@/lib/constants';
import type { GeometryType } from '@/types/index';

export function useThreeScene() {
  const objects = useSceneStore((state) => state.objects);
  const selectedId = useSceneStore((state) => state.selectedId);
  const addObject = useSceneStore((state) => state.addObject);
  const removeObject = useSceneStore((state) => state.removeObject);
  const duplicateObject = useSceneStore((state) => state.duplicateObject);
  const selectObject = useSceneStore((state) => state.selectObject);
  const updateTransform = useSceneStore((state) => state.updateTransform);
  const updateMaterial = useSceneStore((state) => state.updateMaterial);
  const setObjectVisibility = useSceneStore((state) => state.setObjectVisibility);
  const setObjectLocked = useSceneStore((state) => state.setObjectLocked);
  const undo = useSceneStore((state) => state.undo);
  const redo = useSceneStore((state) => state.redo);

  const [meshes] = useState<Map<string, THREE.Mesh>>(new Map());

  const addGeometry = useCallback(
    (type: GeometryType, name?: string) => {
      const mesh = new THREE.Mesh(createGeometry(type), createMaterial(DEFAULT_MATERIAL));
      mesh.name = name || type;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      applyTransformToMesh(mesh, {
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      });
      meshes.set(mesh.uuid, mesh);
      const node = addObject(type, name);
      return { node, mesh };
    },
    [addObject, meshes],
  );

  const handleSelect = useCallback((id: string | null) => {
    selectObject(id);
  }, [selectObject]);

  return {
    objects,
    selectedId,
    meshes,
    addGeometry,
    removeObject,
    duplicateObject,
    selectObject: handleSelect,
    updateTransform,
    updateMaterial,
    setObjectVisibility,
    setObjectLocked,
    undo,
    redo,
    extractTransformFromMesh,
    updateMaterialFromProps: updateMaterial,
  };
}
