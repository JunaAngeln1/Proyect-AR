import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useGestureStore } from '@/stores/gestureStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  Camera,
  StopCircle,
  Hand,
  Settings,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
} from 'lucide-react';
import type { GestureName } from '@/types/index';

const GESTURE_LABELS: Record<GestureName, string> = {
  select: 'Seleccionar',
  drag: 'Arrastrar',
  move: 'Mover',
  rotate: 'Rotar',
  scale: 'Escalar',
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  pause: 'Pausar',
};

export function GestureLab() {
  const enabled = useGestureStore((state) => state.enabled);
  const confidenceThreshold = useGestureStore((state) => state.confidenceThreshold);
  const smoothing = useGestureStore((state) => state.smoothing);
  const gestures = useGestureStore((state) => state.gestures);
  const handData = useGestureStore((state) => state.handData);
  const cameraActive = useGestureStore((state) => state.cameraActive);
  const setEnabled = useGestureStore((state) => state.setEnabled);
  const setConfig = useGestureStore((state) => state.setConfig);
  const setCameraActive = useGestureStore((state) => state.setCameraActive);
  const reset = useGestureStore((state) => state.reset);
  const { announce } = useAccessibility();

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const toggleCamera = async () => {
    if (cameraActive) {
      try {
        stream?.getTracks().forEach((t) => t.stop());
      } catch {}
      setStream(null);
      setCameraActive(false);
      setEnabled(false);
      announce('Cámara de gestos desactivada');
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      await new Promise((r) => { if (videoRef.current) videoRef.current.onloadedmetadata = r; });
      setCameraActive(true);
      setEnabled(true);
      announce('Cámara de gestos activada. Muestra tu mano.');
    } catch (err: any) {
      announce('No se pudo acceder a la cámara: ' + err.message);
    }
  };

  const handleGestureToggle = (name: GestureName) => {
    setConfig({ gestures: { ...gestures, [name]: !gestures[name] } });
    announce(`${GESTURE_LABELS[name]} ${gestures[name] ? 'activado' : 'desactivado'}`);
  };

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Laboratorio de Gestos" padding="sm" className="z-10">
        <div className="flex items-center gap-3">
          <Button
            variant={cameraActive ? 'secondary' : 'default'}
            onClick={toggleCamera}
            className="flex items-center gap-2"
            aria-pressed={cameraActive}
          >
            {cameraActive ? <StopCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {cameraActive ? 'Detener cámara' : 'Activar cámara'}
          </Button>
          <Toggle
            checked={enabled}
            onCheckedChange={(checked) => setEnabled(checked)}
            label="Gestos habilitados"
          />
          <Button variant="outline" size="sm" onClick={reset} title="Restablecer">
            <Settings className="w-4 h-4" /> Reset
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2 px-2">
          <span className="text-xs text-text-secondary">Confianza:</span>
          <input
            type="range"
            min="0.1"
            max="0.99"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) =>
              setConfig({ confidenceThreshold: parseFloat(e.target.value) })
            }
            className="w-32 accent-blue"
            aria-label="Umbral de confianza de gestos"
          />
          <span className="text-xs font-mono text-text">{confidenceThreshold.toFixed(2)}</span>
        </div>
      </Panel>

      <div className="flex-1 flex overflow-hidden">
        <section className="w-3/5 border-r border-text-secondary/10 p-6 flex flex-col">
          <div className="relative w-full aspect-video bg-black rounded-xl border border-text-secondary/20 overflow-hidden">
            {stream && videoRef.current ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary">
                <Camera className="w-16 h-16 mb-3 opacity-20" />
                <p>Cámara no activada</p>
              </div>
            )}
            {cameraActive && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded text-xs text-green">
                <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span>Cámara activa (procesamiento local)</span>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-3">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Gesto detectado</h3>
            <div className="flex items-center gap-3 p-3 rounded bg-panel/50 border border-text-secondary/10">
              <Hand className="w-5 h-5 text-blue" />
              <span className="font-mono text-text">{handData.detected ? handData.gesture ?? '—' : 'Sin detección'}</span>
              <span className="ml-auto text-xs text-text-secondary">Confianza {handData.confidence.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="w-2/5 p-6 overflow-y-auto">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Gestos configurables</h3>
          <div className="space-y-3">
            {(Object.keys(gestures) as GestureName[]).map((name) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 rounded bg-panel/50 border border-text-secondary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-text-secondary/10">
                    <Hand className="w-4 h-4 text-text-secondary" />
                  </div>
                  <span className="text-sm text-text">{GESTURE_LABELS[name]}</span>
                </div>
                <Toggle
                  checked={gestures[name]}
                  onCheckedChange={() => handleGestureToggle(name)}
                  label=""
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-panel/50 border-t border-text-secondary/10 p-4 text-xs text-text-secondary">
        <p>Alternativas: teclado, mouse y controles táctiles están siempre disponibles. Los gestos son comandos personalizados, no interpretación de lenguas de señas.</p>
      </div>
    </div>
  );
}
