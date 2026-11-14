import * as React from 'react';
import { Panel } from '@/components/ui/panel';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { useAccessibilityStore } from '@/stores/accessibilityStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import type { AccessibilitySettings } from '@/types/index';
import {
  Eye,
  Text,
  Maximize,
  Keyboard,
  Moon,
  Sun,
  SlidersHorizontal,
} from 'lucide-react';

const SETTINGS: Array<{
  key: keyof AccessibilitySettings;
  label: string;
  description: string;
  Icon: React.ElementType;
}> = [
  {
    key: 'highContrast',
    label: 'Alto contraste',
    description: 'Colores con mayor relación de contraste para baja visión.',
    Icon: Eye,
  },
  {
    key: 'largeText',
    label: 'Texto ampliado',
    description: 'Incrementa el tamaño de texto en toda la interfaz.',
    Icon: Text,
  },
  {
    key: 'largeButtons',
    label: 'Botones grandes',
    description: 'Objetivos táctiles más grandes para motricidad reducida.',
    Icon: Maximize,
  },
  {
    key: 'reduceMotion',
    label: 'Reducir animaciones',
    description: 'Desactiva transiciones y movimientos innecesarios.',
    Icon: Moon,
  },
  {
    key: 'simplifiedMode',
    label: 'Modo simplificado',
    description: 'Interfaz reducida con solo las funciones esenciales.',
    Icon: SlidersHorizontal,
  },
  {
    key: 'screenReaderLabels',
    label: 'Etiquetas para lectores de pantalla',
    description: 'Agrega etiquetas ARIA a todos los controles.',
    Icon: Keyboard,
  },
  {
    key: 'focusIndicators',
    label: 'Indicadores de foco visibles',
    description: 'Resalta el elemento con el foco de teclado.',
    Icon: Sun,
  },
];

export function AccessibilitySettings() {
  const store = useAccessibilityStore();
  const settings: Record<string, boolean> = {
    highContrast: store.highContrast,
    largeText: store.largeText,
    largeButtons: store.largeButtons,
    reduceMotion: store.reduceMotion,
    simplifiedMode: store.simplifiedMode,
    screenReaderLabels: store.screenReaderLabels,
    focusIndicators: store.focusIndicators,
  };
  const setSetting = useAccessibilityStore((state) => state.setSetting);
  const reset = useAccessibilityStore((state) => state.reset);
  const { announce } = useAccessibility();

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Panel title="Configuración de Accesibilidad" padding="sm" className="z-10">
        <p className="text-xs text-text-secondary">
          Objetivo: conformidad WCAG 2.2 AA. Los cambios se aplican inmediatamente y se guardan localmente.
        </p>
      </Panel>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {SETTINGS.map((s) => (
            <div key={s.key} className="bg-panel rounded-xl border border-text-secondary/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded flex items-center justify-center bg-blue/10 text-blue">
                    <s.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{s.label}</h4>
                    <p className="text-xs text-text-secondary">{s.description}</p>
                  </div>
                </div>
                <Toggle
                  checked={Boolean(settings[s.key])}
                  onCheckedChange={(checked) => {
                    setSetting(s.key, checked);
                    announce(`${s.label} ${checked ? 'activado' : 'desactivado'}`);
                  }}
                  label={s.label}
                  ariaLabel={s.label}
                />
              </div>
            </div>
          ))}
          <div className="pt-4">
            <Button variant="outline" size="sm" onClick={() => { reset(); announce('Configuración restablecida'); }}>
              Restablecer valores predeterminados
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
