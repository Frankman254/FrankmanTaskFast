# Continuacion MVP

## Rama actual
- Trabajar sobre `codex/mvp-local-board-foundation`

## Donde estamos
- La app ya funciona como MVP local con `localStorage` centralizado.
- El modelo canónico compartido vive en `packages/types/index.ts`.
- El frontend usa `useBoardState` como capa de aplicacion y `board-repository.ts` como persistencia.
- El tablero ya tiene:
  - drag and drop persistido
  - dashboard por `grilla.tipo`
  - validaciones basicas
  - edicion de proyecto
  - inspector lateral de tarea en desktop
  - edicion inline de grillas
  - filtros por estado, columna y tipo
  - vista calendario simple
  - inspector en modal para mobile

## Piezas clave
- Estado y composicion principal:
  - `apps/web/src/components/BodyFull.tsx`
- Persistencia local y migracion:
  - `apps/web/src/lib/board-repository.ts`
- Hook de aplicacion:
  - `apps/web/src/hooks/useBoardState.ts`
- Tablero Kanban:
  - `apps/web/src/components/ProyectoTablero.tsx`
  - `apps/web/src/components/Grillas.tsx`
  - `apps/web/src/components/Tarea.tsx`
- Calendario simple:
  - `apps/web/src/components/TaskCalendarView.tsx`
- Inspector de tarea:
  - `apps/web/src/components/TaskInspector.tsx`
- Responsive helper:
  - `apps/web/src/hooks/use-media-query.ts`

## Como probar rapido
1. Crear proyecto.
2. Crear varias grillas con tipos distintos.
3. Crear tareas con y sin fechas.
4. Editar una grilla inline.
5. Filtrar por columna y por tipo.
6. Cambiar entre vista tablero y calendario.
7. Abrir una tarea en desktop y en mobile.
8. Mover tareas entre columnas y recargar.
9. Borrar una grilla con tareas y recargar.

## Comandos utiles
### Type-check web
```powershell
& 'C:\Program Files\cursor\resources\app\resources\helpers\node.exe' .\node_modules\typescript\lib\tsc.js -p .\apps\web\tsconfig.json --noEmit
```

### Type-check types
```powershell
& 'C:\Program Files\cursor\resources\app\resources\helpers\node.exe' .\node_modules\typescript\lib\tsc.js -p .\packages\types\tsconfig.json --noEmit
```

### Build frontend
```powershell
& 'C:\Program Files\cursor\resources\app\resources\helpers\node.exe' ..\..\node_modules\vite\bin\vite.js build
```
Ejecutar desde:
```text
apps/web
```

## Proximos pasos recomendados
- Convertir el inspector mobile en drawer con gesto de cierre.
- Agregar filtros por prioridad y rango de fechas.
- Hacer que el calendario tenga vista semanal real.
- Añadir edicion inline de proyecto o de tareas rapidas.
- Crear una capa `ApiBoardRepository` para cambiar la fuente de verdad sin tocar UI.
- Unificar mejor la experiencia de drag cuando hay filtros activos.

## Riesgos o detalles a recordar
- Cuando hay filtros activos, el tablero sigue mostrando todas las grillas pero solo algunas tareas. Eso es seguro para no romper el reorder, pero puede confundir un poco visualmente.
- El calendario es una agenda simple agrupada por fecha, no una grilla mensual.
- La app sigue siendo local-first. No hay backend real como fuente de verdad todavia.
- `baseline-browser-mapping` da warning en build, pero no bloquea.

## Criterio para la siguiente fase
- Si el objetivo es MVP presentable: enfocar UX, drawer mobile, feedback visual y polish.
- Si el objetivo es producto real: empezar por `ApiBoardRepository`, endpoints CRUD y sincronizacion.
