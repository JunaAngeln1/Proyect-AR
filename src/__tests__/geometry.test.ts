import { describe, it, expect } from 'vitest';
import {
  createGeometry,
  applyTransformToMesh,
  extractTransformFromMesh,
  createMaterial,
  buildGeometryLabel,
} from '@/utils/geometry';
import * as THREE from 'three';
import type { GeometryType, TransformProps, MaterialProps } from '@/types/index';

describe('geometry utils', () => {
  it('debe crear geometrías por tipo', () => {
    const types: GeometryType[] = ['cube', 'sphere', 'cylinder', 'cone', 'plane', 'pyramid', 'text'];
    types.forEach((t) => {
      const geo = createGeometry(t);
      expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    });
  });

  it('debe aplicar y extraer transformación de un mesh', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const transform: TransformProps = {
      position: { x: 1, y: 2, z: 3 },
      rotation: { x: 0.1, y: 0.2, z: 0.3 },
      scale: { x: 2, y: 2, z: 2 },
    };
    applyTransformToMesh(mesh, transform);
    const extracted = extractTransformFromMesh(mesh);
    expect(extracted.position.x).toBeCloseTo(1);
    expect(extracted.position.y).toBeCloseTo(2);
    expect(extracted.position.z).toBeCloseTo(3);
    expect(extracted.scale.x).toBeCloseTo(2);
  });

  it('debe crear un material estándar', () => {
    const material = createMaterial({ color: { r: 1, g: 0, b: 0 }, metalness: 0.5, roughness: 0.5, opacity: 1, transparent: false });
    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
  });

  it('debe devolver etiquetas de geometría', () => {
    expect(buildGeometryLabel('cube')).toBe('Cubo');
    expect(buildGeometryLabel('sphere')).toBe('Esfera');
  });
});
