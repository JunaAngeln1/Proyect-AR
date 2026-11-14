# 3D Inclusive Studio

Plataforma web de modelado tridimensional básica, accesible y orientada a estudiantes, docentes, principiantes y personas con diferentes necesidades de accesibilidad.

## Tecnologías

- React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React
- Three.js, React Three Fiber, Drei, Zustand
- Google Model Viewer, WebXR
- MediaPipe Tasks Vision (Hand Landmarker)
- Supabase (Auth, PostgreSQL, Storage, RLS)
- Vitest, React Testing Library, Playwright, axe-core

## Requisitos

- Node.js >= 18
- npm >= 9
- Navegador con WebGL (Creator/Viewer)
- Dispositivo con cámara y WebXR para AR y gestos (con fallback)

## Instalación

```bash
npm install
cp .env.example .env
# Edita .env con tu URL y clave anónima de Supabase
npm run dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (TypeScript + Vite) |
| `npm run preview` | Vista previa del build |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Pruebas end-to-end (Playwright) |
| `npm run lint` | Lint de ESLint |

## Supabase

Aplica las migraciones en `supabase/migrations/001_initial.sql` en tu proyecto de Supabase y configura Row Level Security.

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Añade las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Despliega. El comando de build es `npm run build` y el directorio de salida es `dist`.

## Accesibilidad

WCAG 2.2 AA objetivo. Pruebas automáticas con axe-core incluidas en el flujo de e2e.

## Licencia

MIT
