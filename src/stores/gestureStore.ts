import { create } from 'zustand';
import type { GestureConfig, HandData, GestureName } from '@/types/index';
import { DEFAULT_GESTURE_CONFIG } from '@/lib/constants';

export interface GestureActions {
  setEnabled: (enabled: boolean) => void;
  setConfig: (config: Partial<GestureConfig>) => void;
  setHandData: (data: HandData) => void;
  setCameraActive: (active: boolean) => void;
  reset: () => void;
}

type GestureStore = GestureConfig & {
  handData: HandData;
  cameraActive: boolean;
  calibrationOffset: { x: number; y: number } | null;
} & GestureActions;

export const useGestureStore = create<GestureStore>((set, get) => ({
  ...DEFAULT_GESTURE_CONFIG,
  handData: {
    detected: false,
    hand: null,
    landmarks: [],
    gesture: null,
    confidence: 0,
  },
  cameraActive: false,
  calibrationOffset: null,

  setEnabled: (enabled) => set({ enabled }),

  setConfig: (config) =>
    set((state) => ({
      ...state,
      ...config,
      gestures: { ...state.gestures, ...config.gestures },
    })),

  setHandData: (data) => set({ handData: data }),

  setCameraActive: (active) => set({ cameraActive: active }),

  reset: () =>
    set({
      ...DEFAULT_GESTURE_CONFIG,
      handData: {
        detected: false,
        hand: null,
        landmarks: [],
        gesture: null,
        confidence: 0,
      },
      cameraActive: false,
      calibrationOffset: null,
    }),

  isGestureEnabled: (name: GestureName) => {
    const state = get();
    return state.enabled && Boolean(state.gestures[name]);
  },
}));
