export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smooth(
  current: number,
  target: number,
  factor: number,
): number {
  return lerp(current, target, factor);
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function distance3d(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  return Math.sqrt(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2,
  );
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11)}`;
}
