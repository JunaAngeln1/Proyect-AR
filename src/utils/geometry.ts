import * as THREE from 'three';
import type { Object3DNode, GeometryType, MaterialProps, TransformProps } from '@/types/index';
import { DEFAULT_MATERIAL } from '@/lib/constants';
import { generateId } from './math';

export function createObjectNode(
  type: GeometryType,
  name: string,
  transform: TransformProps,
  material: MaterialProps = { ...DEFAULT_MATERIAL },
): Object3DNode {
  const now = new Date().toISOString();
  return {
    id: generateId('obj'),
    name,
    type,
    parentId: null,
    transform: { ...transform },
    material: { ...material },
    visible: true,
    locked: false,
    castShadow: true,
    receiveShadow: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function createGeometry(type: GeometryType): THREE.BufferGeometry {
  switch (type) {
    case 'cube':
      return new THREE.BoxGeometry(1, 1, 1);
    case 'sphere':
      return new THREE.SphereGeometry(0.5, 32, 32);
    case 'cylinder':
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    case 'cone':
      return new THREE.ConeGeometry(0.5, 1, 32);
    case 'plane':
      return new THREE.PlaneGeometry(1, 1);
    case 'pyramid':
      return new THREE.ConeGeometry(0.5, 1, 4);
    case 'text':
      return new THREE.BoxGeometry(1, 1, 1);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}

export function applyTransformToMesh(
  mesh: THREE.Object3D,
  transform: TransformProps,
): void {
  mesh.position.set(transform.position.x, transform.position.y, transform.position.z);
  mesh.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
  mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
  mesh.updateMatrixWorld();
}

export function extractTransformFromMesh(mesh: THREE.Object3D): TransformProps {
  return {
    position: { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z },
    rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z },
    scale: { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z },
  };
}

export function createMaterial(props: MaterialProps): THREE.Material {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(props.color.r, props.color.g, props.color.b),
    metalness: props.metalness,
    roughness: props.roughness,
    opacity: props.opacity,
    transparent: props.transparent,
  });
}

export function updateMaterial(mesh: THREE.Mesh, props: MaterialProps): void {
  if (mesh.material instanceof THREE.MeshStandardMaterial) {
    mesh.material.color.setRGB(props.color.r, props.color.g, props.color.b);
    mesh.material.metalness = props.metalness;
    mesh.material.roughness = props.roughness;
    mesh.material.opacity = props.opacity;
    mesh.material.transparent = props.transparent;
    mesh.material.needsUpdate = true;
  }
}

export function buildGeometryLabel(type: GeometryType): string {
  const labels: Record<GeometryType, string> = {
    cube: 'Cubo',
    sphere: 'Esfera',
    cylinder: 'Cilindro',
    cone: 'Cono',
    plane: 'Plano',
    pyramid: 'Pirámide',
    text: 'Texto 3D',
  };
  return labels[type];
}
