import * as React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useARCompatibility } from './arCompatibility';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { Globe, Smartphone, QrCode, X, AlertCircle, CheckCircle2, Monitor } from 'lucide-react';

interface ARViewerProps {
  modelUrl?: string;
  onExit?: () => void;
}

export function ARViewer({ modelUrl, onExit }: ARViewerProps) {
  const { compatible, arMode, reason, checkCompatibility, setMode } = useARCompatibility();
  const [isActive, setIsActive] = React.useState(false);
  const [fallback, setFallback] = React.useState(false);
  const { announce } = useAccessibility();

  React.useEffect(() => {
    checkCompatibility();
  }, [checkCompatibility]);

  const handleEnterAR = () => {
    if (!compatible) {
      setFallback(true);
      announce('AR no compatible. Usando visualización 3D convencional.');
      return;
    }
    setIsActive(true);
    setFallback(false);
    announce(`Realidad aumentada activada (${arMode})`);
  };

  const handleExit = () => {
    setIsActive(false);
    onExit?.();
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Realidad Aumentada" padding="sm" className="z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-text-secondary/10 border border-text-secondary/20">
            {compatible ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green" />
                <span className="text-xs text-text">Dispositivo compatible con AR</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-300">AR no compatible: {reason}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded border border-text-secondary/20">
            <span className="text-xs text-text-secondary">Modo:</span>
            <span className="text-xs font-mono text-blue">{arMode ?? '—'}</span>
          </div>
        </div>
      </Panel>

      {compatible && !fallback ? (
        <div className="flex-1 relative">
          {/* model-viewer para AR real */}
          <model-viewer
            src={modelUrl}
            alt="Modelo 3D en realidad aumentada"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity={1}
            exposure={1}
            environment-image="neutral"
            style={{ width: '100%', height: 'calc(100vh - 64px)', display: 'block' }}
            className="bg-black"
          >
            <button slot="ar-button" className="hidden" />
          </model-viewer>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExit} title="Salir de AR" aria-label="Salir de realidad aumentada">
              <>
                <X className="w-4 h-4" /> Salir
              </>
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 z-20 text-[10px] text-text-secondary bg-panel/80 backdrop-blur px-3 py-2 rounded border border-text-secondary/20">
            Coloca el modelo en una superficie. Mueve el dispositivo para explorar.
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center space-4">
            <div className="w-24 h-24 bg-panel rounded-2xl border border-text-secondary/20 flex items-center justify-center mb-4">
              <Monitor className="w-10 h-10 text-text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-text">Visualización 3D convencional</h2>
            <p className="text-text-secondary max-w-xs mx-auto">
              Este dispositivo no soporta realidad aumentada. Puedes visualizar el modelo en 3D interactivo abajo.
            </p>
          </div>
          <div className="w-full max-w-md bg-panel rounded-xl border border-text-secondary/20 p-6 shadow-lg">
            <p className="text-sm text-text-secondary mb-4">
              Modelo: <span className="font-mono text-text">{modelUrl ? modelUrl.split('/').pop() : 'modelo'}</span>
            </p>
            <Button variant="default" onClick={() => announce('Modelo cargado en vista 3D')} className="w-full">
              Ver modelo en 3D
            </Button>
          </div>
        </div>
      )}

      {!compatible && fallback && (
        <div className="absolute inset-0 z-50 bg-bg/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">AR no disponible</h3>
          <p className="text-text-secondary mb-6">
            {reason}. Se usará la visualización 3D convencional.
          </p>
          <Button variant="default" onClick={() => { setFallback(false); announce('Vista 3D activada'); }} className="w-48">
            Usar visualización 3D
          </Button>
        </div>
      )}
    </div>
  );
}
