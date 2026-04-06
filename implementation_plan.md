# FrankmanTaskFast - Bug Fix + UI/UX Overhaul

## Análisis del Proyecto

FrankmanTaskFast es una aplicación Kanban con React 19 + TypeScript + Vite + Tailwind v3 + @dnd-kit. Monorepo con workspaces (`apps/web`, `apps/api`). Tiene tema oscuro/claro configurado (ThemeProvider) pero **no está conectado** al App.

---

## 🐛 BUG CRÍTICO: No se pueden soltar tareas en grillas vacías

### Diagnóstico

El problema está en la interacción entre la **collision detection** customizada y el sistema de **refs combinadas** en `Grillas.tsx`.

**Causa raíz:** Cuando una grilla está vacía, la collision detection en `ProyectoTablero.tsx` (línea 288-340) tiene esta lógica:

1. Para tareas, primero busca colisiones con `closestCenter` → filtra solo tareas
2. Si hay tareas, devuelve esas colisiones (línea 296-298) ← **aquí se detiene**
3. Solo si **NO hay tareas** busca droppables con `rectIntersection`

**El problema real:** Cuando arrastras sobre una grilla vacía, el `closestCenter` puede detectar tareas de **otras grillas** como la colisión más cercana, impidiendo que se llegue a la detección de droppables. Además, la ref combinada (`combinedRef`) en Grillas.tsx mezcla el sortable y droppable principal, lo que causa conflictos cuando el PointerSensor intenta resolver a qué droppable apuntar.

**Solución:** 
1. En la collision detection, filtrar colisiones de tareas solo de la grilla donde está el cursor (no cualquier tarea cercana).
2. Dar prioridad al `droppable-tareas-grilla-*` cuando no hay tareas debajo, ya que ese es el área explícita para recibir tareas en la grilla.
3. Simplificar la collision detection para usar `DragOverEvent` + `onDragOver` en vez de solo `onDragEnd`.

---

## 📋 Cambios Propuestos

### Fase 1: Bug Fix - Drag & Drop en Grillas Vacías

#### [MODIFY] [ProyectoTablero.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/ProyectoTablero.tsx)

1. **Reescribir la collision detection** para manejar correctamente grillas vacías:
   - Cuando se arrastra una tarea, siempre incluir los droppables de grillas como posibles targets
   - No filtrar prematuramente los droppables cuando hay tareas en colisión que pertenecen a **otra** grilla
   - Usar `pointerWithin` como estrategia base para tareas (más intuitiva para el usuario)

2. **Agregar `onDragOver`** para manejar movimientos entre grillas en tiempo real (preview visual)

#### [MODIFY] [Grillas.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/Grillas.tsx)

1. **Separar refs**: No combinar sortable + droppable en el mismo nodo. El sortable va en el contenedor externo, el droppable solo en el área de tareas.
2. Mejorar feedback visual cuando una tarea está siendo arrastrada sobre la grilla.

---

### Fase 2: UI/UX Overhaul - Diseño Premium con Dark/Light Mode

> [!IMPORTANT]
> Este es un cambio visual GRANDE. El diseño actual se ve como un prototipo funcional. Vamos a transformarlo en una app premium con diseño moderno.

#### Diseño propuesto:
- **Paleta de colores**: Inspirada en tu landing page (verde neón como accent, temas claros y oscuros elegantes)
- **Tipografía**: Google Font "Inter" para limpieza y legibilidad
- **Glassmorphism**: Cards con backdrop-filter para las grillas
- **Micro-animaciones**: Transiciones suaves en todo (hover, drag, modals)
- **Layout**: Sidebar colapsable a la izquierda, header más limpio, tabs rediseñados
- **Formularios**: Modals overlay en vez de reemplazar el sidebar (UX mucho mejor)
- **Cards de tarea**: Rediseño completo con avatares, badges de prioridad con colores, hover effects

#### [MODIFY] [index.css](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/index.css)
- CSS variables para dark/light mode completo
- Design tokens (spacing, colors, shadows, borders, etc.)
- System font stack premium (Inter)
- Animaciones globales (@keyframes)

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/tailwind.config.ts)
- Extend con colores custom usando CSS variables
- Dark mode via class strategy
- Font family custom

#### [MODIFY] [App.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/app/App.tsx)
- Envolver con ThemeProvider (ya existe pero no se usa)
- Layout mejorado con sidebar

#### [MODIFY] [main.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/app/main.tsx)
- Import Google Fonts

#### [MODIFY] [Header.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/Header.tsx)
- Rediseño completo: Logo + navigation + theme toggle + user avatar
- Glassmorphism effect
- Dark mode support

#### [MODIFY] [BodyFull.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/BodyFull.tsx)
- Formularios como **modal overlay** (dialog) en vez de reemplazar sidebar
- Layout mejorado con flex responsive
- Tabs de proyectos rediseñados (más como Chrome tabs)
- Dark mode classes

#### [MODIFY] [Grillas.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/Grillas.tsx)
- Glassmorphism cards
- Header de grilla con icon + count badge
- Área de tareas con scroll más elegante
- Botones rediseñados inline
- Dark mode support
- Mejor feedback visual para drag states

#### [MODIFY] [Tarea.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/Tarea.tsx)
- Card rediseñada con: avatar mini, badge de prioridad mejorado, fecha, hover glow
- Micro-animaciones al hover
- Dark mode support

#### [MODIFY] [FormNewProyect.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/FormNewProyect.tsx)
- Convertir a modal overlay
- Inputs estilizados con labels floating
- Color picker mejorado
- Validación visual
- Dark mode support

#### [MODIFY] [FormNewGrilla.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/FormNewGrilla.tsx)
- Mismas mejoras que FormNewProyect

#### [MODIFY] [FormAddTarea.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/FormAddTarea.tsx)
- Mismas mejoras + selector de prioridad visual (dropdown con colores)
- Date pickers para fechas

#### [MODIFY] [Footer.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/Footer.tsx)
- Footer minimalista con dark mode

#### [MODIFY] [RightBar.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/RightBar.tsx)
- Ya no se necesita como sidebar estática → se convierte en panel de detalles/info del proyecto

#### [MODIFY] [ButtonAdd.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/ButtonAdd.tsx)
- Botón con diseño premium (gradient, hover scale, icon)

#### [MODIFY] [ButtonDeleteGrilla.tsx](file:///c:/Users/frank/Desktop/2025/FrankmanTaskFast/apps/web/src/components/ButtonDeleteGrilla.tsx)
- Icono de trash + confirm tooltip
- Hover red glow

---

### Fase 3: Cosas Obsoletas / Mejoras Técnicas

#### Problemas encontrados:

1. **ThemeProvider no conectado**: Existe `theme-provider.tsx`, `theme-context.ts`, y `use-theme.ts` pero **NO se usan** en `main.tsx` ni App.tsx. Conectarlos.

2. **`useGrillas.ts` hook no usado**: El hook existe pero BodyFull maneja todo con useState local. → Eliminar o integrar.

3. **RightBar "Table of Contents"**: Es placeholder con datos hardcodeados que no hacen nada. → Rediseñar como panel contextual.

4. **react-router-dom instalado pero no usado**: Está en dependencies pero no hay ninguna ruta configurada. → Remover por ahora o implementar rutas.

5. **`@frankman-task-fast/config` y `@frankman-task-fast/types`**: Packages del monorepo probablemente vacíos/no usados por web. Verificar.

6. **Data default harcodeada en 10 grillas**: Demasiadas grillas default distribuidas por modulo entre 3 proyectos. Reducir a algo más realista.

7. **`handleUpdateTareas` recibe TODAS las tareas**: Cuando se arrastra a otra grilla, se pasan todas las tareas del proyecto entero. Es ineficiente. Mejor pasar solo los cambios.

8. **IDs con `Date.now()`**: Los IDs temporales usan `Date.now()` pero luego se sobrescriben por `getNextId()`. Inconsistencia.

9. **`border-spacing-y-96`**: Esta clase Tailwind no existe/no hace lo que se espera. Remover.

10. **Formularios reemplazan el sidebar**: La UX es confusa - al abrir un form, desaparece el sidebar. Mejor usar modals overlay.

---

## User Review Required

> [!IMPORTANT] 
> **¿Estás de acuerdo con transformar los formularios laterales en modals overlay?** Esto cambia significativamente la UX pero es mucho más intuitivo (el contexto del tablero se mantiene visible).

> [!IMPORTANT]
> **¿Quieres mantener el sidebar izquierdo (RightBar/Table of Contents) o prefieres eliminarlo?** Actualmente no tiene funcionalidad real. Podemos:
> - A) Eliminarlo completamente y dar más espacio al tablero
> - B) Convertirlo en un panel colapsable con info del proyecto (estadísticas, filtros, etc.)

> [!IMPORTANT]
> **¿Quieres que mantengamos Tailwind CSS v3 o hay preferencia para algo diferente?** El proyecto ya lo usa extensivamente.

> [!IMPORTANT]
> **`react-router-dom` está instalado pero no se usa.** ¿Lo removemos o planeas agregar páginas/rutas más adelante?

## Open Questions

- ¿Hay algún color o estilo específico que quieras para la app, o me guío de la paleta de tu Landing Page (verde neón + negro/plateado)?
- ¿El backend API (`apps/api`) está funcional o es solo estructura? Necesito saber para no romper nada.

## Verification Plan

### Automated Tests
- Levantar dev server (`npm run dev:web`) y verificar que compila sin errores
- Probar drag & drop de tareas a grillas vacías en el browser
- Probar drag & drop de tareas entre grillas con tareas
- Probar reordenamiento de grillas
- Verificar toggle dark/light mode
- Verificar formularios modales

### Manual Verification  
- Visual review de la UI en ambos modos (dark/light)
- Test de responsive en diferentes viewport sizes
- Verificar que todas las acciones CRUD funcionan (crear proyecto, grilla, tarea)
