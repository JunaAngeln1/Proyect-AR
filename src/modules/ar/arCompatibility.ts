import { create } from 'zustand';
import { DEFAULT_GESTURE_CONFIG } from '@/lib/constants';
import type { GestureConfig } from '@/types/index';

export type ARMode = 'webxr' | 'scene-viewer' | 'quick-look' | 'none';

interface ARCompatibilityState {
  compatible: boolean;
  arMode: ARMode | null;
  reason: string | null;
  checking: boolean;
  checkCompatibility: () => void;
  setMode: (mode: ARMode | null) => void;
}

const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
const supportsWebXR = 'xr' in navigator;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

export const useARCompatibility = create<ARCompatibilityState>((set) => ({
  compatible: false,
  arMode: null,
  reason: null,
  checking: false,

  checkCompatibility: () => {
    set({ checking: true });
    // Detectar modo de AR disponible
    let mode: ARMode = 'none';
    let compatible = false;
    let reason = '';

    if (supportsWebXR && isSecureContext) {
      compatible = true;
      mode = 'webxr';
      reason = 'WebXR disponible';
    } else if (isAndroid) {
      compatible = true;
      mode = 'scene-viewer';
      reason = 'Scene Viewer (Android) disponible';
    } else if (isIOS) {
      compatible = true;
      mode = 'quick-look';
      reason = 'Quick Look (iOS) disponible';
    } else {
      compatible = false;
      reason = 'Ningún modo de AR disponible en este dispositivo';
    }

    set({ compatible, arMode: mode, reason, checking: false });
  },

  setMode: (mode) => set({ arMode: mode }),
}));

export function detectAR(): { compatible: boolean; mode: ARMode; reason: string } {
  const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
  const supportsWebXR = 'xr' in navigator;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (supportsWebXR && isSecure) {
    return { compatible: true, mode: 'webxr', reason: 'WebXR disponible' };
  }
  if (isAndroid) {
    return { compatible: true, mode: 'scene-viewer', reason: 'Scene Viewer (Android)' };
  }
  if (isIOS) {
    return { compatible: true, mode: 'quick-look', reason: 'Quick Look (iOS)' };
  }
  return { compatible: false, mode: 'none', reason: 'No AR disponible' };
}
