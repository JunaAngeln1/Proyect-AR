import { describe, it, expect } from 'vitest';
import { recognizeGesture, fingersUp, isGestureEnabled } from '@/modules/gestures/gestures';
import type { GestureConfig } from '@/types/index';

describe('gestures', () => {
  const hand21 = Array.from({ length: 21 }, (_, i) => ({ x: i / 100, y: i / 100, z: 0 }));

  it('reconoce gesto de selección (índice arriba)', () => {
    const lm = [...hand21];
    lm[8].y = -0.2; // punta índice arriba
    lm[6].y = 0.1;  // unión índice abajo
    const { gesture, confidence } = recognizeGesture(
      lm,
      { confidenceThreshold: 0.7, smoothing: 0.6, gestures: { select: true, drag: false, move: false, rotate: false, scale: false, confirm: false, cancel: false, pause: false } },
      null,
    );
    expect(gesture).toBe('select');
    expect(confidence).toBeGreaterThan(0);
  });

  it('reconoce gesto de escala (pinch pulgar-índice)', () => {
    const lm = [...hand21];
    lm[4] = { x: 0.5, y: 0.5, z: 0 };   // pulgar
    lm[8] = { x: 0.51, y: 0.51, z: 0 }; // índice muy cerca
    const { gesture } = recognizeGesture(
      lm,
      { confidenceThreshold: 0.7, smoothing: 0.6, gestures: { select: false, drag: false, move: false, rotate: false, scale: true, confirm: false, cancel: false, pause: false } },
      null,
    );
    expect(gesture).toBe('scale');
  });

  it('isGestureEnabled respeta el flag global y el gesto individual', () => {
    const config: GestureConfig = { enabled: true, confidenceThreshold: 0.7, smoothing: 0.6, gestures: { select: true, drag: false, move: false, rotate: false, scale: false, confirm: false, cancel: false, pause: false } };
    expect(isGestureEnabled('select', config)).toBe(true);
    expect(isGestureEnabled('drag', config)).toBe(false);

    const disabled: GestureConfig = { ...config, enabled: false };
    expect(isGestureEnabled('select', disabled)).toBe(false);
  });
});
