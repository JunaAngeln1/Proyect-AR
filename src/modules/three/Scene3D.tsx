import * as React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { TransformControls, Grid, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AxesHelper } from 'three';
import type { Object3DNode, GeometryType } from '@/types/index';
import { useSceneStore } from '@/stores/sceneStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  createGeometry,
  createMaterial,
  applyTransformToMesh,
} from '@/utils/geometry';

interface Scene3DProps {
  className?: string;
  transformMode?: 'translate' | 'rotate' | 'scale';
  selectedId?: string | null;
  objects?: Object3DNode[];
}

/**
 * Componente interno que vive DENTRO del Canvas y puede usar hooks de R3F.
 */
function CameraController({
  cameraPosition,
  cameraTarget,
}: {
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
}) {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    camera.updateProjectionMatrix();
  }, [camera, cameraPosition, cameraTarget]);
  return null;
}

export function Scene3D({
  className,
  transformMode = 'translate',
  selectedId,
  objects: objectsProp,
}: Scene3DProps) {
  const objects = objectsProp ?? useSceneStore((state) => state.objects);
  const showGrid = useSceneStore((state) => state.showGrid);
  const showAxes = useSceneStore((state) => state.showAxes);
  const gridSize = useSceneStore((state) => state.gridSize);
  const gridDivisions = useSceneStore((state) => state.gridDivisions);
  const cameraPosition = useSceneStore((state) => state.cameraPosition);
  const cameraTarget = useSceneStore((state) => state.cameraTarget);
  const selectObject = useSceneStore((state) => state.selectObject);
  const updateTransform = useSceneStore((state) => state.updateTransform);
  const { containerClass } = useAccessibility();

  const selectedRef = React.useRef<THREE.Object3D | null>(null);
  const meshesRef = React.useRef<Map<string, THREE.Mesh>>(new Map());

  // Sincronizar transform del store a los meshes existentes
  React.useEffect(() => {
    objects.forEach((node) => {
      const mesh = meshesRef.current.get(node.id);
      if (!mesh) return;
      mesh.position.set(
        node.transform.position.x,
        node.transform.position.y,
        node.transform.position.z
      );
      mesh.rotation.set(
        node.transform.rotation.x,
        node.transform.rotation.y,
        node.transform.rotation.z
      );
      mesh.scale.set(
        node.transform.scale.x,
        node.transform.scale.y,
        node.transform.scale.z
      );
      mesh.visible = node.visible;
      mesh.material = createMaterial(node.material);
    });
  }, [objects]);

  // Actualizar referencia al objeto seleccionado para el gizmo
  React.useEffect(() => {
    const selId = selectedId ?? null;
    selectedRef.current = selId ? meshesRef.current.get(selId) ?? null : null;
  }, [selectedId, objects]);

  const handleObjectClick = (event: any, id: string) => {
    event.stopPropagation();
    selectObject(id);
  };

  return (
    <div className={['relative w-full h-full', className].filter(Boolean).join(' ')}>
      <Canvas
        shadows
        camera={{ fov: 45, near: 0.1, far: 1000 }}
        className="w-full h-full"
        style={{ backgroundColor: '#0B1020' }}
      >
        <CameraController
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <OrbitControls makeDefault />
        <Grid
          args={[gridSize, gridDivisions]}
          cellColor="#151D30"
          cellThickness={1}
          sectionColor="#3987FF"
          sectionThickness={2}
          visible={showGrid}
        />
        {showAxes && <primitive object={new AxesHelper(3)} />}
        <SceneObjects
          objects={objects}
          selectedId={selectedId ?? null}
          meshesRef={meshesRef}
          onClick={handleObjectClick}
        />
        {selectedRef.current && selectedId && (
          <TransformControls
            object={selectedRef.current}
            enabled={true}
            mode={transformMode}
            onMouseUp={() => {}}
            onChange={() => {
              if (!selectedRef.current || !selectedId) return;
              const m = selectedRef.current;
              updateTransform(selectedId, {
                position: { x: m.position.x, y: m.position.y, z: m.position.z },
                rotation: { x: m.rotation.x, y: m.rotation.y, z: m.rotation.z },
                scale: { x: m.scale.x, y: m.scale.y, z: m.scale.z },
              });
            }}
          />
        )}
      </Canvas>
      <div
        id="a11y-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden"
      />
    </div>
  );
}

function SceneObjects({
  objects,
  selectedId,
  meshesRef,
  onClick,
}: {
  objects: Object3DNode[];
  selectedId: string | null;
  meshesRef: React.MutableRefObject<Map<string, THREE.Mesh>>;
  onClick: (event: any, id: string) => void;
}) {
  return (
    <group name="objects-group">
      {objects.map((node) => (
        <mesh
          key={node.id}
          name={node.name}
          visible={node.visible}
          castShadow={node.castShadow}
          receiveShadow={node.receiveShadow}
          onClick={(event) => onClick(event, node.id)}
          ref={(ref) => {
            if (ref) meshesRef.current.set(node.id, ref);
          }}
        >
          <primitive object={createGeometry(node.type)} />
          <meshStandardMaterial
            color={new THREE.Color(
              node.material.color.r,
              node.material.color.g,
              node.material.color.b
            )}
            metalness={node.material.metalness}
            roughness={node.material.roughness}
            transparent={node.material.transparent}
            opacity={node.material.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
