import { describe, it, expect, beforeEach } from 'vitest';
import { useSceneStore } from '@/stores/sceneStore';

function state() {
  return useSceneStore.getState();
}

describe('sceneStore', () => {
  beforeEach(() => {
    useSceneStore.setState({
      objects: [],
      selectedId: null,
      history: [],
      historyIndex: -1,
    });
  });

  it('debe añadir un objeto y seleccionarlo', () => {
    const { addObject } = state();
    const node = addObject('cube', 'Mi cubo');
    const s = state();
    expect(s.objects.length).toBeGreaterThan(0);
    expect(node.name).toBe('Mi cubo');
    expect(s.selectedId).toBe(node.id);
  });

  it('debe eliminar un objeto y deseleccionarlo si está seleccionado', () => {
    const { addObject, removeObject } = state();
    const node = addObject('sphere');
    removeObject(node.id);
    const s = state();
    expect(s.objects.find((o) => o.id === node.id)).toBeUndefined();
    expect(s.selectedId).toBeNull();
  });

  it('debe duplicar un objeto', () => {
    const { addObject, duplicateObject } = state();
    const node = addObject('cube');
    const clone = duplicateObject(node.id);
    expect(clone).not.toBeNull();
    expect(clone!.name).toContain(node.name);
    const s = state();
    expect(s.objects.length).toBe(2);
  });

  it('debe actualizar la transformación de un objeto', () => {
    const { addObject, updateTransform } = state();
    const node = addObject('cube');
    updateTransform(node.id, { position: { x: 5, y: 0, z: 0 } });
    const s = state();
    const updated = s.objects.find((o) => o.id === node.id);
    expect(updated!.transform.position.x).toBe(5);
  });

  it('debe hacer undo y redo', () => {
    const { addObject, removeObject, undo, redo } = state();
    const node = addObject('cube');
    removeObject(node.id);
    undo();
    const s1 = state();
    expect(s1.objects.find((o) => o.id === node.id)).toBeDefined();
    redo();
    const s2 = state();
    expect(s2.objects.find((o) => o.id === node.id)).toBeUndefined();
  });

  it('debe exportar e importar escena JSON', () => {
    const { addObject, exportSceneJSON, importSceneJSON } = state();
    addObject('cone', 'Cono test');
    const json = exportSceneJSON();
    expect(json).toContain('Cono test');
    useSceneStore.setState({
      objects: [],
      selectedId: null,
      history: [],
      historyIndex: -1,
    });
    const ok = importSceneJSON(json);
    expect(ok).toBe(true);
    expect(useSceneStore.getState().objects.find((o) => o.name === 'Cono test')).toBeDefined();
  });

  it('debe bloquear un objeto impidiendo su transformación', () => {
    const { addObject, setObjectLocked, updateTransform } = state();
    const node = addObject('cube');
    setObjectLocked(node.id, true);
    updateTransform(node.id, { position: { x: 99, y: 0, z: 0 } });
    const s = state();
    const updated = s.objects.find((o) => o.id === node.id);
    expect(updated!.transform.position.x).not.toBe(99);
  });
});
