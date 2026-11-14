export const APP_NAME = '3D Inclusive Studio';

export const COLORS = {
  bg: '#0B1020',
  panel: '#151D30',
  blue: '#3987FF',
  purple: '#8B5CF6',
  green: '#22C55E',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
} as const;

import type {
  MaterialProps,
  TransformProps,
  SceneState,
  GeometryType,
  GestureConfig,
  AccessibilitySettings,
  GestureName,
} from '@/types/index';

export const DEFAULT_MATERIAL: MaterialProps = {
  color: { r: 0.5, g: 0.7, b: 1, hex: '#7FABFF' },
  metalness: 0.2,
  roughness: 0.6,
  opacity: 1,
  transparent: false,
};

export const DEFAULT_TRANSFORM: TransformProps = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export const DEFAULT_SCENE: SceneState = {
  objects: [],
  selectedId: null,
  cameraPosition: { x: 0, y: 4, z: 8 },
  cameraTarget: { x: 0, y: 0, z: 0 },
  gridSize: 20,
  gridDivisions: 40,
  showAxes: true,
  showGrid: true,
};

export const GEOMETRY_LABELS: Record<GeometryType, string> = {
  cube: 'Cubo',
  sphere: 'Esfera',
  cylinder: 'Cilindro',
  cone: 'Cono',
  plane: 'Plano',
  pyramid: 'Pirámide',
  text: 'Texto 3D',
};

export const GESTURE_NAMES: GestureName[] = [
  'select',
  'drag',
  'move',
  'rotate',
  'scale',
  'confirm',
  'cancel',
  'pause',
];

export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  enabled: false,
  confidenceThreshold: 0.7,
  smoothing: 0.6,
  gestures: {
    select: true,
    drag: true,
    move: true,
    rotate: true,
    scale: true,
    confirm: true,
    cancel: true,
    pause: true,
  },
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  largeButtons: false,
  reduceMotion: false,
  simplifiedMode: false,
  screenReaderLabels: true,
  focusIndicators: true,
};

// Mediappe model assets (deben descargarse o usarse desde CDN)
export const MEDIAPIPE_HAND_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/float16/1/hand_landmarker.task';

export type { MaterialProps, TransformProps, SceneState, GestureConfig, AccessibilitySettings };
