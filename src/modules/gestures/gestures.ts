import type { GestureName, HandData, GestureConfig } from '@/types/index';

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

export interface GestureRecognizerConfig {
  confidenceThreshold: number;
  smoothing: number;
  gestures: Record<GestureName, boolean>;
}

export function fingersUp(landmarks: Array<{ x: number; y: number; z: number }>): FingerState {
  if (landmarks.length < 21) {
    return { thumb: false, index: false, middle: false, ring: false, pinky: false };
  }
  // Índice de puntos clave (MediaPipe Hand Landmarker)
  const tips = [4, 8, 12, 16, 20];
  const pip = [3, 6, 10, 14, 18];
  const names: Array<'thumb' | 'index' | 'middle' | 'ring' | 'pinky'> = [
    'thumb',
    'index',
    'middle',
    'ring',
    'pinky',
  ];

  const state: FingerState = { thumb: false, index: false, middle: false, ring: false, pinky: false };
  names.forEach((name, i) => {
    const tip = landmarks[tips[i]];
    const joint = landmarks[pip[i]];
    // En y, menor valor = más arriba (imagen invertida)
    state[name] = tip.y < joint.y;
  });
  return state;
}

export function distance2d(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function recognizeGesture(
  landmarks: Array<{ x: number; y: number; z: number }>,
  config: GestureRecognizerConfig,
  previous: GestureName | null,
): { gesture: GestureName | null; confidence: number } {
  if (landmarks.length < 21) {
    return { gesture: null, confidence: 0 };
  }
  const fingers = fingersUp(landmarks);
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const thumbTip = landmarks[4];

  // Seleccionar: índice arriba, resto abajo
  if (
    config.gestures.select &&
    fingers.index &&
    !fingers.middle &&
    !fingers.ring &&
    !fingers.pinky
  ) {
    return { gesture: 'select', confidence: 0.85 };
  }

  // Arrastrar / mover: índice + medio arriba
  if (
    (config.gestures.drag || config.gestures.move) &&
    fingers.index &&
    fingers.middle &&
    !fingers.ring &&
    !fingers.pinky
  ) {
    return { gesture: 'drag', confidence: 0.8 };
  }

  // Rotar: tres dedos arriba
  if (
    config.gestures.rotate &&
    fingers.index &&
    fingers.middle &&
    fingers.ring &&
    !fingers.pinky
  ) {
    return { gesture: 'rotate', confidence: 0.8 };
  }

  // Escalar: pulgar + índice cerca (pinch)
  const pinch = distance2d(
    { x: thumbTip.x, y: thumbTip.y },
    { x: indexTip.x, y: indexTip.y },
  );
  if (config.gestures.scale && pinch < 0.04) {
    return { gesture: 'scale', confidence: 0.85 };
  }

  // Confirmar: puño cerrado (ningún dedo arriba)
  if (
    config.gestures.confirm &&
    !fingers.index &&
    !fingers.middle &&
    !fingers.ring &&
    !fingers.pinky
  ) {
    return { gesture: 'confirm', confidence: 0.8 };
  }

  // Cancelar: mano abierta (todos arriba)
  if (
    config.gestures.cancel &&
    fingers.index &&
    fingers.middle &&
    fingers.ring &&
    fingers.pinky
  ) {
    return { gesture: 'cancel', confidence: 0.8 };
  }

  return { gesture: previous, confidence: 0 };
}

export function smoothGesture(
  current: GestureName | null,
  previous: GestureName | null,
  framesStable: number,
  requiredFrames: number = 3,
): GestureName | null {
  if (current === null) return null;
  if (current !== previous) return null;
  if (framesStable < requiredFrames) return null;
  return current;
}

export function isGestureEnabled(
  name: GestureName,
  config: GestureConfig,
): boolean {
  return config.enabled && Boolean(config.gestures[name]);
}
