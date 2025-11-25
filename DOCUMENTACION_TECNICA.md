# 🔧 Documentación Técnica Detallada - FrankmanTaskFast

## 📋 Tabla de Contenidos

1. [Arquitectura del Drag and Drop](#arquitectura-del-drag-and-drop)
2. [Sistema de Colisiones](#sistema-de-colisiones)
3. [Gestión de Estado](#gestión-de-estado)
4. [Flujo de Eventos Completo](#flujo-de-eventos-completo)
5. [Optimizaciones y Mejores Prácticas](#optimizaciones-y-mejores-prácticas)

---

## 🎯 Arquitectura del Drag and Drop

### Estructura de IDs

Cada elemento arrastrable tiene un ID único con un prefijo:

```typescript
// Grillas
id: `grilla-${grilla.id}`  // Ejemplo: "grilla-1"

// Tareas
id: `tarea-${tarea.id}`    // Ejemplo: "tarea-5"

// Áreas droppables
id: `droppable-grilla-${grilla.id}`           // Área principal de la grilla
id: `droppable-tareas-grilla-${grilla.id}`    // Área específica de tareas
```

**¿Por qué prefijos?**
- Permite identificar rápidamente qué tipo de elemento es
- Facilita el filtrado en `handleDragEnd`

### Jerarquía de Contextos

```
DndContext (nivel superior)
  └── SortableContext (grillas - horizontal)
      └── Grilla 1
          └── SortableContext (tareas - vertical)
              └── Tarea 1
              └── Tarea 2
      └── Grilla 2
          └── SortableContext (tareas - vertical)
              └── Tarea 3
```

**¿Por qué anidados?**
- Cada nivel maneja su propio tipo de arrastre
- Las grillas se mueven horizontalmente
- Las tareas se mueven verticalmente dentro de su grilla

---

## 🎯 Sistema de Colisiones

### Estrategia de Detección

```typescript
collisionDetection={(args) => {
  const activeId = String(args.active.id)
  
  // Para grillas: solo detecta otras grillas
  if (activeId.startsWith('grilla-')) {
    const collisions = rectIntersection(args)
    return collisions.filter(collision => {
      const collisionId = String(collision.id)
      return collisionId.startsWith('grilla-') && 
             collisionId !== activeId
    })
  }
  
  // Para tareas: prioriza tareas, luego droppables
  const collisions = closestCenter(args)
  const tareaCollisions = collisions.filter(c => 
    String(c.id).startsWith('tarea-')
  )
  
  if (tareaCollisions.length > 0) {
    return tareaCollisions  // Prioridad a tareas
  }
  
  // Si no hay tareas, buscar droppables
  const droppableCollisions = rectIntersection({
    ...args,
    droppableContainers: args.droppableContainers.filter(container => {
      const id = String(container.id)
      return id.startsWith('droppable-grilla-') || 
             id.startsWith('droppable-tareas-grilla-')
    }),
  })
  
  return droppableCollisions
}}
```

### Explicación de las Estrategias

**1. `closestCenter`:**
- Encuentra el elemento más cercano al centro del elemento arrastrado
- Bueno para elementos pequeños (tareas)
- Más preciso para ordenamiento

**2. `rectIntersection`:**
- Detecta si los rectángulos (áreas) se superponen
- Bueno para áreas grandes (grillas, droppables)
- Más tolerante, mejor para grillas vacías

**¿Por qué dos estrategias?**
- `closestCenter` es mejor para tareas (precisión)
- `rectIntersection` es mejor para áreas grandes (facilidad de uso)

---

## 📊 Gestión de Estado

### Flujo de Estado en BodyFull

```typescript
// Estado principal
const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosDefault)
const [todasLasGrillas, setTodasLasGrillas] = useState<Grilla[]>(grillasConProyecto)
const [todasLasTareas, setTodasLasTareas] = useState<Tarea[]>(tareasDefault)
const [proyectoActivo, setProyectoActivo] = useState<number | null>(...)

// Estado de UI (qué formulario mostrar)
const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false)
const [isModalOpenTarea, setIsModalOpenTarea] = useState(false)
const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false)
```

### Filtrado de Datos

```typescript
// En ProyectoTablero, filtrar grillas del proyecto activo
const grillasDelProyecto = todasLasGrillas.filter(
  g => g.proyect_id === proyectoActivo
)

// En Grillas, filtrar tareas de esa grilla
const tareasDeEstaGrilla = tareas
  .filter(t => t.grilla_id === grilla.id)
  .sort((a, b) => (a.position || 0) - (b.position || 0))
```

**¿Por qué filtrar en cada componente?**
- Cada componente solo necesita sus propios datos
- Más eficiente que pasar todo
- Facilita la reutilización

---

## 🔄 Flujo de Eventos Completo

### Escenario: Mover una Tarea de Grilla 1 a Grilla 2

#### Paso 1: Inicio del Drag
```typescript
// Usuario hace clic y arrastra Tarea 1
onDragStart={(event) => {
  setActiveId(String(event.active.id))  // Guarda "tarea-1"
  // Muestra el DragOverlay
}}
```

#### Paso 2: Durante el Drag
```typescript
// Mientras arrastra, collisionDetection se ejecuta constantemente
collisionDetection={(args) => {
  // Detecta sobre qué está pasando
  // Si está sobre Grilla 2 vacía:
  // - No encuentra tareas (grilla vacía)
  // - Encuentra droppable-tareas-grilla-2
  return droppableCollisions  // Retorna el droppable
}}
```

#### Paso 3: Feedback Visual
```typescript
// En Grillas.tsx
const { isOver } = useDroppable({
  id: `droppable-tareas-grilla-${grilla.id}`
})

// isOver se vuelve true cuando algo está sobre este droppable
// Esto activa el feedback visual:
className={`... ${isOver ? 'ring-2 ring-blue-500' : ''}`}
```

#### Paso 4: Fin del Drag
```typescript
onDragEnd={(event) => {
  const { active, over } = event
  // active.id = "tarea-1"
  // over.id = "droppable-tareas-grilla-2"
  
  // Extraer IDs
  const tareaId = parseInt(active.id.replace('tarea-', ''))  // 1
  const nuevaGrillaId = parseInt(
    over.id.replace('droppable-tareas-grilla-', '')
  )  // 2
  
  // Actualizar estado
  const nuevasTareas = tareas.map(t => {
    if (t.id === tareaId) {
      return {
        ...t,
        grilla_id: nuevaGrillaId,  // Cambiar de grilla 1 a 2
        position: nuevaPosicion,
        updated_at: new Date().toISOString()
      }
    }
    return t
  })
  
  onUpdateTareas(nuevasTareas)  // Actualizar en BodyFull
}}
```

#### Paso 5: Re-renderizado
```typescript
// React detecta el cambio de estado
// Re-renderiza los componentes afectados:
// - Grilla 1: ahora tiene una tarea menos
// - Grilla 2: ahora tiene una tarea más
// - Las posiciones se recalculan automáticamente
```

---

## 🎨 DragOverlay - El Elemento Flotante

### ¿Qué es?

Es una copia del elemento que se está arrastrando que sigue el cursor.

```typescript
<DragOverlay>
  {activeId ? (
    activeId.startsWith('grilla-') ? (
      // Muestra una copia de la grilla
      <div className="... shadow-2xl rotate-2">
        {/* Contenido de la grilla */}
      </div>
    ) : activeId.startsWith('tarea-') ? (
      // Muestra una copia de la tarea
      <div className="... shadow-2xl rotate-2">
        {/* Contenido de la tarea */}
      </div>
    ) : null
  ) : null}
</DragOverlay>
```

**¿Por qué existe?**
- El elemento original se vuelve semi-transparente
- El overlay sigue el cursor suavemente
- Mejor experiencia visual

---

## 🔧 Optimizaciones y Mejores Prácticas

### 1. Uso de `arrayMove`

```typescript
// ❌ MAL: Reordenar manualmente
const newItems = [...items]
const [removed] = newItems.splice(oldIndex, 1)
newItems.splice(newIndex, 0, removed)

// ✅ BIEN: Usar arrayMove de dnd-kit
const newItems = arrayMove(items, oldIndex, newIndex)
```

**¿Por qué?**
- `arrayMove` está optimizado
- Menos código
- Más legible

### 2. Ordenamiento Consistente

```typescript
// Siempre ordenar antes de calcular índices
const tareasEnGrilla = tareas
  .filter(t => t.grilla_id === grilla.id)
  .sort((a, b) => (a.position || 0) - (b.position || 0))
```

**¿Por qué?**
- Asegura que los índices sean correctos
- Evita bugs de posicionamiento

### 3. Validación de Índices

```typescript
const oldIndex = tareasEnGrilla.findIndex(t => t.id === tareaId)
const newIndex = tareasEnGrilla.findIndex(t => t.id === overTareaId)

if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
  return  // No hacer nada si hay error
}
```

**¿Por qué?**
- Previene errores si algo sale mal
- Evita actualizaciones innecesarias

### 4. Actualización Inmutable del Estado

```typescript
// ✅ BIEN: Crear nuevo array
const nuevasTareas = tareas.map(t => {
  if (t.id === tareaId) {
    return { ...t, grilla_id: nuevaGrillaId }
  }
  return t
})

// ❌ MAL: Mutar directamente
tareas.find(t => t.id === tareaId).grilla_id = nuevaGrillaId
```

**¿Por qué?**
- React detecta cambios solo con referencias nuevas
- Evita bugs de estado inconsistente

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: Las tareas no se mueven entre grillas vacías

**Causa:** El droppable no se detecta correctamente

**Solución:**
```typescript
// Agregar droppable específico para el área de tareas
const { setNodeRef: setDroppableTareasRef, isOver } = useDroppable({
  id: `droppable-tareas-grilla-${grilla.id}`
})

// Usar rectIntersection para mejor detección
const droppableCollisions = rectIntersection({
  ...args,
  droppableContainers: args.droppableContainers.filter(container => {
    const id = String(container.id)
    return id.startsWith('droppable-tareas-grilla-')
  }),
})
```

### Problema 2: Las posiciones no se actualizan correctamente

**Causa:** No se están recalculando las posiciones después de mover

**Solución:**
```typescript
// Recalcular todas las posiciones después de mover
const tareasActualizadas = nuevasTareas.map((t) => {
  const tareasEnGrilla = nuevasTareas
    .filter(ta => ta.grilla_id === t.grilla_id)
    .sort((a, b) => (a.position || 0) - (b.position || 0))
  const posicionEnGrilla = tareasEnGrilla.findIndex(ta => ta.id === t.id)
  return {
    ...t,
    position: posicionEnGrilla + 1
  }
})
```

### Problema 3: El drag and drop no funciona en móviles

**Causa:** Falta configuración de sensores táctiles

**Solución:**
```typescript
import { PointerSensor, TouchSensor } from '@dnd-kit/core'

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,  // Requiere mover 8px antes de activar
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,  // Espera 200ms en touch
      tolerance: 5,
    },
  })
)
```

---

## 📈 Mejoras Futuras Posibles

### 1. Persistencia de Datos
```typescript
// Guardar en localStorage
useEffect(() => {
  localStorage.setItem('tareas', JSON.stringify(todasLasTareas))
}, [todasLasTareas])

// Cargar al iniciar
useEffect(() => {
  const saved = localStorage.getItem('tareas')
  if (saved) {
    setTodasLasTareas(JSON.parse(saved))
  }
}, [])
```

### 2. Animaciones Mejoradas
```typescript
// Usar Framer Motion para animaciones más suaves
import { motion } from 'framer-motion'

<motion.div
  layout
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Contenido */}
</motion.div>
```

### 3. Undo/Redo
```typescript
// Guardar historial de cambios
const [history, setHistory] = useState<Tarea[][]>([])
const [historyIndex, setHistoryIndex] = useState(-1)

const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1)
    setTodasLasTareas(history[historyIndex - 1])
  }
}
```

### 4. Optimización con useMemo
```typescript
// Memoizar cálculos costosos
const grillasDelProyecto = useMemo(() => {
  return todasLasGrillas.filter(
    g => g.proyect_id === proyectoActivo
  )
}, [todasLasGrillas, proyectoActivo])
```

---

## 🎓 Conceptos Avanzados Explicados

### 1. Refs en React

```typescript
// Ref = Referencia directa al elemento DOM
const setNodeRef = (node: HTMLDivElement | null) => {
  // node es el elemento HTML real
  // Puedes hacer cosas con él directamente
}

// En dnd-kit, los refs conectan elementos al sistema
<div ref={setNodeRef}>
  {/* Este div está conectado al sistema de drag */}
</div>
```

### 2. Transform y CSS

```typescript
// transform contiene la posición calculada
const style = {
  transform: CSS.Transform.toString(transform)
  // Convierte { x: 10, y: 20 } a "translate3d(10px, 20px, 0)"
}

// Se aplica al elemento para moverlo visualmente
<div style={style}>
  {/* El elemento se mueve según transform */}
</div>
```

### 3. Event Propagation

```typescript
// stopPropagation evita que el evento suba
onPointerDown={(e) => {
  e.stopPropagation()  // No activa el drag del padre
}}

// preventDefault evita el comportamiento por defecto
onClick={(e) => {
  e.preventDefault()  // No recarga la página
}}
```

---

## 📚 Referencias Técnicas

### @dnd-kit API

- **DndContext**: https://docs.dndkit.com/api-documentation/context-provider
- **useSortable**: https://docs.dndkit.com/api-documentation/sortable/use-sortable
- **useDroppable**: https://docs.dndkit.com/api-documentation/droppable/use-droppable
- **collisionDetection**: https://docs.dndkit.com/api-documentation/context-provider/collision-detection

### React Hooks

- **useState**: https://react.dev/reference/react/useState
- **useEffect**: https://react.dev/reference/react/useEffect
- **useMemo**: https://react.dev/reference/react/useMemo
- **useCallback**: https://react.dev/reference/react/useCallback

---

**Esta documentación técnica complementa la documentación principal. Úsala cuando necesites entender los detalles de implementación.**

