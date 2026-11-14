# Documentación de compatibilidad AR — 3D Inclusive Studio

## Resumen

El módulo **AR & Gestos** (`/ar`) permite visualizar modelos 3D en realidad aumentada cuando el dispositivo lo soporta, y ofrece una visualización 3D convencional como alternativa cuando no hay compatibilidad.

## Modos de realidad aumentada soportados

Se utiliza `<model-viewer>` con el atributo `ar-modes="webxr scene-viewer quick-look"`:

| Modo | Plataforma | Requisitos |
|------|-----------|------------|
| **WebXR** | Navegadores con WebXR (Chrome, Edge, etc.) | HTTPS o `localhost`, navegador con `navigator.xr`, sesión inmersiva AR |
| **Scene Viewer** | Android (Google Play Services AR) | Dispositivo Android con ARCore |
| **Quick Look** | iOS / iPadOS | Safari, iOS 12+, dispositivo compatible con ARKit |

## Detección de compatibilidad

Antes de mostrar las opciones de AR, la app ejecuta `useARCompatibility()` (`src/modules/ar/arCompatibility.ts`) que verifica:

1. `window.isSecureContext` (HTTPS o localhost).
2. Existencia de `navigator.xr` (WebXR).
3. Sistema operativo (`iOS` → Quick Look, `Android` → Scene Viewer).

Resultado posible:

- `compatible: true` + `arMode: 'webxr' | 'scene-viewer' | 'quick-look'` → se muestra el botón de entrar a AR con `<model-viewer ar>`.
- `compatible: false` → se oculta AR y se muestra la visualización 3D convencional. **Nunca se simula AR** en dispositivos no compatibles.

## Flujo de experiencia

1. Usuario accede a `/ar`.
2. Se detecta la compatibilidad al montar el componente.
3. Si compatible:
   - Se renderiza `<model-viewer src={modelUrl} ar ar-modes="webxr scene-viewer quick-look" camera-controls>`.
   - El usuario pulsa el botón AR integrado de model-viewer para colocar el modelo en una superficie.
   - Puede escalar, rotar y cambiar la ubicación mediante los controles de model-viewer y gestos del dispositivo.
   - "Reiniciar la experiencia": recargar el visor / reposicionar el modelo.
4. Si no compatible:
   - Se muestra aviso y alternativa de visualización 3D convencional.

## Limitaciones conocidas

- WebXR requiere contexto seguro (HTTPS). En desarrollo con `localhost` funciona.
- Scene Viewer requiere Google Play Services para AR (ARCore) en Android.
- Quick Look solo en iOS/Safari.
- En escritorio sin WebXR se usa la alternativa 3D convencional.

## Pruebas

- Prueba unitaria: `src/__tests__/gestures.test.ts` (utilidades de gesto/umbral).
- Prueba e2e: `e2e/a11y.spec.ts` y `e2e/viewer.spec.ts` (carga y renderizado del visor).
