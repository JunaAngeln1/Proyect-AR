/**
 * Tipos compartidos de 3D Inclusive Studio.
 * Toda la escena se serializa a JSON para persistir en Supabase.
 */

export type GeometryType =
  | 'cube'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'plane'
  | 'pyramid'
  | 'text';

export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

export interface ColorLike {
  r: number;
  g: number;
  b: number;
  hex?: string;
}

export interface MaterialProps {
  color: ColorLike;
  metalness: number;
  roughness: number;
  opacity: number;
  transparent: boolean;
}

export interface TransformProps {
  position: Vector3Like;
  rotation: Vector3Like; // radianes
  scale: Vector3Like;
}

export interface Object3DNode {
  id: string;
  name: string;
  type: GeometryType;
  parentId: string | null;
  transform: TransformProps;
  material: MaterialProps;
  visible: boolean;
  locked: boolean;
  castShadow: boolean;
  receiveShadow: boolean;
  // metadata de componentes (para Viewer/AR)
  componentInfo?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface SceneState {
  objects: Object3DNode[];
  selectedId: string | null;
  cameraPosition: Vector3Like;
  cameraTarget: Vector3Like;
  gridSize: number;
  gridDivisions: number;
  showAxes: boolean;
  showGrid: boolean;
}

export interface HistoryEntry {
  scene: SceneState;
  timestamp: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  scene: SceneState;
  thumbnail_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  accessibility_settings: AccessibilitySettings;
  created_at: string;
  updated_at: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  largeButtons: boolean;
  reduceMotion: boolean;
  simplifiedMode: boolean;
  screenReaderLabels: boolean;
  focusIndicators: boolean;
}

export interface GestureConfig {
  enabled: boolean;
  confidenceThreshold: number;
  smoothing: number; // 0..1
  gestures: Record<GestureName, boolean>;
}

export type GestureName =
  | 'select'
  | 'drag'
  | 'move'
  | 'rotate'
  | 'scale'
  | 'confirm'
  | 'cancel'
  | 'pause';

export interface HandData {
  detected: boolean;
  hand: 'left' | 'right' | null;
  landmarks: Array<{ x: number; y: number; z: number }>;
  gesture: GestureName | null;
  confidence: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'es' | 'en';
  notifications: boolean;
}

export interface GLBFile {
  id: string;
  project_id: string | null;
  name: string;
  size: number;
  url: string;
  path: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
}
