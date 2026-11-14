import { useCallback } from 'react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { announceToScreenReader } from '@/utils/a11y';

export function useAccessibility() {
  const settings = useAccessibilityStore((state) => ({
    highContrast: state.highContrast,
    largeText: state.largeText,
    largeButtons: state.largeButtons,
    reduceMotion: state.reduceMotion,
    simplifiedMode: state.simplifiedMode,
    screenReaderLabels: state.screenReaderLabels,
    focusIndicators: state.focusIndicators,
  }));
  const setSetting = useAccessibilityStore((state) => state.setSetting);
  const toggleSetting = useAccessibilityStore((state) => state.toggleSetting);
  const applyPreset = useAccessibilityStore((state) => state.applyPreset);
  const reset = useAccessibilityStore((state) => state.reset);

  const announce = useCallback((message: string) => {
    if (settings.screenReaderLabels) {
      announceToScreenReader(message);
    }
  }, [settings.screenReaderLabels]);

  const containerClass = useCallback(() => {
    const cls: string[] = [];
    if (settings.highContrast) cls.push('high-contrast');
    if (settings.reduceMotion) cls.push('reduce-motion');
    if (settings.largeText) cls.push('large-text');
    return cls.join(' ');
  }, [settings]);

  return {
    settings,
    setSetting,
    toggleSetting,
    applyPreset,
    reset,
    announce,
    containerClass,
  };
}
