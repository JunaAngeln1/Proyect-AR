import * as React from 'react';

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

export function FocusRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:outline-none rounded">
      {children}
    </div>
  );
}

export function Announcer({ message }: { message: string }) {
  React.useEffect(() => {
    const el = document.getElementById('a11y-announcer');
    if (el) {
      el.textContent = '';
      void el.offsetHeight;
      el.textContent = message;
    }
  }, [message]);
  return null;
}
