export function announceToScreenReader(message: string): void {
  const existing = document.getElementById('a11y-announcer');
  if (existing) {
    existing.textContent = '';
    void existing.offsetHeight; // force reflow
    existing.textContent = message;
    return;
  }
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  announcer.textContent = message;
  document.body.appendChild(announcer);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  element.addEventListener('keydown', handleKeydown);
  first?.focus();
  return () => element.removeEventListener('keydown', handleKeydown);
}

export function getContrastColor(hex: string): 'light' | 'dark' {
  const c = hex.replace('#', '');
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
}

export function focusableSelector(): string {
  return 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
}
