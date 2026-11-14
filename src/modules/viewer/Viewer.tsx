import * as React from 'react';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { TransformControls, OrbitControls, Grid } from '@react-three/drei';
import { AxesHelper } from 'three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  Maximize,
  Minimize,
  RefreshCw,
  Expand,
  Globe,
  Info,
  File,
} from 'lucide-react';

interface ViewerProps {
  glbUrl?: string;
  file?: File;
}

export function Viewer({ glbUrl, file }: ViewerProps) {
  const [model, setModel] = React.useState<THREE.Group | null>(null);
  const [components, setComponents] = React.useState<Array<{ name: string; id: string }>>([]);
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const { announce } = useAccessibility();

  React.useEffect(() => {
    const loader = new GLTFLoader();
    setLoading(true);
    setError(null);
    const load = async (url: string) => {
      try {
        const gltf = await loader.loadAsync(url);
        setModel(gltf.scene);
        const comps = gltf.scene.children.map((c, i) => ({
          name: c.name || `Componente ${i + 1}`,
          id: c.uuid,
        }));
        setComponents(comps);
        announce('Modelo cargado');
      } catch (err: any) {
        setError(err.message);
        announce('Error al cargar el modelo');
      } finally {
        setLoading(false);
      }
    };
    if (glbUrl) load(glbUrl);
    else if (file) {
      const url = URL.createObjectURL(file);
      load(url);
    }
  }, [glbUrl, file]);

  const handleComponentClick = (event: ThreeEvent<React.MouseEvent>, id: string) => {
    event.stopPropagation();
    setSelectedComponent(id);
    announce(`Componente seleccionado`);
  };

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 5);
      cameraRef.current.lookAt(0, 0, 0);
      announce('Cámara restablecida');
    }
  };

  const handleToggleFullscreen = () => {
    const el = document.documentElement;
    if (!isFullscreen) {
      el.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
      announce('Pantalla completa activada');
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
      announce('Pantalla completa desactivada');
    }
  };

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Visor 3D" padding="sm" className="z-10">
        <div className="flex flex-wrap gap-2 items-center">
          {loading ? (
            <span className="text-xs text-blue animate-pulse">Cargando modelo…</span>
          ) : null}
          {error && (
            <span className="text-xs text-red-400">Error: {error}</span>
          )}
          <Button variant="outline" size="icon" onClick={handleResetCamera} title="Restablecer cámara" aria-label="Restablecer cámara">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          {glbUrl && (
            <a
              href={glbUrl}
              download
              className="text-xs text-blue underline hover:text-purple"
              aria-label="Descargar modelo GLB"
            >
              <DownloadIcon className="w-4 h-4 mr-1" /> Descargar
            </a>
          )}
          <input
            type="file"
            accept=".glb,.gltf"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) (Viewer as any)._onFile?.(f);
            }}
            aria-label="Cargar archivo GLB"
          />
          <label
            className="cursor-pointer flex items-center gap-2 text-xs text-text-secondary hover:text-text"
            onClick={() => {
              const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
              input?.click();
            }}
          >
            <File className="w-4 h-4" /> Cargar GLB
          </label>
        </div>
      </Panel>

      <div className="flex-1 relative overflow-hidden">
        <Canvas
          shadows
          camera={{}}
          onCreated={(state) => {
            cameraRef.current = state.camera as THREE.PerspectiveCamera;
            cameraRef.current.position.set(0, 2, 5);
            cameraRef.current.lookAt(0, 0, 0);
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <Grid args={[20, 40]} cellColor="#151D30" sectionColor="#3987FF" />
          <primitive object={new AxesHelper(3)} />
          {model && (
            <primitive object={model}>
              {(model as THREE.Group).traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              })}
            </primitive>
          )}
          {model && (
            <TransformControls
              object={model}
              enabled={false}
              mode="translate"
            />
          )}
        </Canvas>

        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <div className="text-sm font-mono text-text-secondary bg-panel/50 p-2 rounded border border-text-secondary/10">
              {selectedComponent ? `Componente: {selectedComponent.slice(0,8)}…` : 'Selecciona un componente'}
            </div>
            <div className="text-xs font-mono text-text-secondary">
              {components.length} componentes
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <InfoIcon className="w-10 h-10 text-text-secondary/50" />
          </div>
        </div>
      </div>

      {components.length > 0 && (
        <Panel title="Información de componentes" padding="default" className="w-80 bg-panel absolute right-4 top-20 z-20">
          <div className="space-y-2">
            {components.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedComponent(c.id === selectedComponent ? null : c.id)}
                className={[
                  'w-full flex items-center justify-between px-3 py-2 rounded text-sm transition',
                  selectedComponent === c.id
                    ? 'bg-blue/20 border border-blue text-text'
                    : 'hover:bg-text-secondary/10 text-text-secondary border border-transparent',
                ].join(' ')}
                aria-pressed={selectedComponent === c.id}
              >
                <span title={c.name}>{c.name}</span>
                {selectedComponent === c.id && <Globe className="w-3 h-3 fill-blue" />}
              </button>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
