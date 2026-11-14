import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AccessibilitySettings } from '@/types/index';
import { DEFAULT_ACCESSIBILITY } from '@/lib/constants';

export interface AccessibilityActions {
  setSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  applyPreset: (preset: Partial<AccessibilitySettings>) => void;
  reset: () => void;
}

type AccessibilityStore = AccessibilitySettings & AccessibilityActions;

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_ACCESSIBILITY,

      setSetting: (key, value) =>
        set((state) => ({ [key]: value })),

      toggleSetting: (key) =>
        set((state) => ({ [key]: !state[key] })),

      applyPreset: (preset) =>
        set((state) => ({ ...state, ...preset })),

      reset: () => set({ ...DEFAULT_ACCESSIBILITY }),
    }),
    {
      name: 'accessibility-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
