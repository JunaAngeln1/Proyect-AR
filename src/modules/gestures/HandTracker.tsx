import * as React from 'react';
import { useGestureStore } from '@/stores/gestureStore';
import { recognizeGesture, smoothGesture, isGestureEnabled } from './gestures';
import type { GestureName, HandData } from '@/types/index';

interface HandTrackerProps {
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  onGesture?: (gesture: GestureName | null, hand: HandData) => void;
}

export function HandTracker({ videoElement, canvasElement, onGesture }: HandTrackerProps) {
  const enabled = useGestureStore((state) => state.enabled);
  const confidenceThreshold = useGestureStore((state) => state.confidenceThreshold);
  const smoothing = useGestureStore((state) => state.smoothing);
  const setHandData = useGestureStore((state) => state.setHandData);
  const setCameraActive = useGestureStore((state) => state.setCameraActive);

  const prevGestureRef = React.useRef<GestureName | null>(null);
  const stableFramesRef = React.useRef(0);
  const detectorRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!enabled || !videoElement) {
      setCameraActive(false);
      return;
    }
    setCameraActive(true);

    // Nota: MediaPipe Tasks Vision requiere el archivo .task del modelo.
    // La integración real se activa cuando window.FilesetResolver y el modelo están disponibles.
    // Mientras tanto, el resto de la app funciona con teclado/mouse/tacto.

    return () => {
      setCameraActive(false);
    };
  }, [enabled, videoElement, setCameraActive]);

  return null;
}

export function useHandDetection() {
  const handData = useGestureStore((state) => state.handData);
  const enabled = useGestureStore((state) => state.enabled);
  return { handData, enabled };
}
