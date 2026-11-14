# Documentación de gestos y accesibilidad — 3D Inclusive Studio

## Reconocimiento de gestos (MediaPipe)

### Tecnología
- **MediaPipe Tasks Vision** con **Hand Landmarker**.
- Procesamiento **local** en el dispositivo (cuando el modelo `.task` está disponible).
- La cámara solicita **autorización explícita** mediante `navigator.mediaDevices.getUserMedia({ video: true })`.

### Gestos configurables

Cada gesto se puede activar/desactivar individualmente desde el Laboratorio de Gestos (`/gestures`):

| Gesto | Descripción | Detección aproximada |
|-------|-------------|----------------------|
| Seleccionar | Selecciona un objeto | Índice arriba, resto abajo |
| Arrastrar / Mover | Arrastra el objeto seleccionado | Índice + medio arriba |
| Rotar | Rota el objeto | Tres dedos arriba |
| Escalar | Escala el objeto | Pinch (pulgar + índice cerca) |
| Confirmar | Confirma acción | Puño cerrado |
| Cancelar | Cancela acción | Mano abierta (todos los dedos arriba) |
| Pausar | Pausa el seguimiento | — |

### Umbrales y suavizado

- **Umbral de confianza**: configurable (por defecto 0.7). Solo se aceptan gestos con confianza >= umbral.
- **Suavizado**: factor 0..1 aplicado a los landmarks para estabilizar el movimiento.
- **Calibración**: compensación de posición de la mano para evitar activaciones accidentales.
- **Prevención de activaciones accidentales**: un gesto debe mantenerse estable varios frames antes de ejecutarse.

### Indicadores visuales

- Punto rojo pulsante en la esquina superior izquierda cuando la cámara está activa.
- Texto con el gesto detectado y su nivel de confianza.

### Alternativas (siempre disponibles)

El reconocimiento gestual **no es obligatorio**. Toda interacción gestual tiene alternativa mediante:

- **Teclado**: flechas, Enter, Espacio, Esc para navegar y confirmar/cancelar.
- **Mouse**: clic para seleccionar, TransformControls para mover/rotar/escalar.
- **Táctil**: toque para seleccionar, pan/pinch para mover/escalar.

> Los gestos son comandos personalizados de la aplicación. **No se interpreta ni se traduce lenguaje de señas.**

## Accesibilidad (WCAG 2.2 AA objetivo)

### Configuración de accesibilidad (`/accessibility`)

| Ajuste | Efecto |
|--------|--------|
| Alto contraste | Incrementa el contraste de colores para baja visión |
| Texto ampliado | Tamaño de fuente mayor y objetivos táctiles ≥ 44 px |
| Botones grandes | Objetivos táctiles ≥ 48 px |
| Reducir animaciones | Desactiva transiciones y movimientos innecesarios |
| Modo simplificado | Interfaz reducida a funciones esenciales |
| Etiquetas para lectores de pantalla | Atributos ARIA en todos los controles |
| Indicadores de foco | Resalta el elemento con el foco de teclado (anillo azul) |

### Características de accesibilidad implementadas

- Navegación completa por teclado (`Tab`, `Enter`, `Espacio`).
- Indicadores de foco visibles en todos los botones y enlaces.
- Etiquetas `aria-label` / `aria-labelledby` en controles sin texto visible.
- Región `aria-live="polite"` (`#a11y-announcer`) para anuncios a lectores de pantalla.
- Botones grandes y área táctil suficiente.
- Reducción de movimiento (`prefers-reduced-motion` y ajuste manual).
- Paleta profesional con suficiente contraste (fondo #0B1020, texto #F8FAFC).

### Pruebas de accesibilidad

- Automáticas: `axe-core` mediante Playwright (`e2e/a11y.spec.ts`) contra la página `/accessibility`.
- Manuales: navegación exclusiva por teclado, lector de pantalla (NVDA/VoiceOver), inspección de contraste.

## Archivos relacionados

- `src/modules/gestures/gestures.ts` — reconocimiento de gestos y umbrales.
- `src/modules/gestures/GestureLab.tsx` — laboratorio y configuración de gestos.
- `src/modules/gestures/HandTracker.tsx` — integración con cámara/MediaPipe.
- `src/modules/accessibility/AccessibilitySettings.tsx` — ajustes WCAG.
- `src/hooks/useAccessibility.ts` — hook de accesibilidad.
- `src/utils/a11y.ts` — anunciador para lectores de pantalla y captura de foco.
