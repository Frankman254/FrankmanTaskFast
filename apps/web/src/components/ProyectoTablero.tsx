import ButtonAdd from "./ButtonAdd";
import Grillas from "./Grillas";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, rectIntersection } from "@dnd-kit/core";
import type { Grilla } from "../types/models";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Proyecto } from "../types/models";
import type { Tarea } from "../types/models";
import { useState } from "react";

interface ProyectoTableroProps {
    proyecto: Proyecto;
    grillas: Grilla[];
    onUpdateGrillas: (grillas: Grilla[]) => void;
    getNextGrillaId: () => number;
    className?: string;
    tareas: Tarea[];
    onUpdateTareas: (tareas: Tarea[]) => void;
    getNextTareaId: () => number;
    onOpenModalTarea: (grillaId: number) => void;
    onOpenModalGrilla: () => void;
}

export default function ProyectoTablero({ 
    proyecto, 
    grillas, 
    onUpdateGrillas,
    getNextGrillaId,
    className = '',
    tareas,
    onUpdateTareas,
    getNextTareaId,
    onOpenModalTarea,
    onOpenModalGrilla,
}: ProyectoTableroProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // Si es una grilla moviéndose
        if (activeId.startsWith('grilla-') && overId.startsWith('grilla-')) {
            const activeGrillaId = parseInt(activeId.replace('grilla-', ''));
            const overGrillaId = parseInt(overId.replace('grilla-', ''));

            if (activeGrillaId === overGrillaId) return;

            const oldIndex = grillas.findIndex((item) => item.id === activeGrillaId);
            const newIndex = grillas.findIndex((item) => item.id === overGrillaId);

            // Usar arrayMove de dnd-kit para mejor animación
            const grillasReordenadas = arrayMove(grillas, oldIndex, newIndex);

            const grillasActualizadas = grillasReordenadas.map((item, index) => ({
                ...item,
                position: index + 1,
                updated_at: new Date().toISOString(),
            }));

            onUpdateGrillas(grillasActualizadas);
            return;
        }

        // Si es una tarea moviéndose
        if (activeId.startsWith('tarea-')) {
            const tareaId = parseInt(activeId.replace('tarea-', ''));
            const tarea = tareas.find(t => t.id === tareaId);
            
            if (!tarea) return;

            // Si se está moviendo a una grilla (droppable) - tiene prioridad
            if (overId.startsWith('droppable-grilla-') || overId.startsWith('droppable-tareas-grilla-')) {
                const nuevaGrillaId = parseInt(
                    overId.replace('droppable-grilla-', '').replace('droppable-tareas-grilla-', '')
                );
                
                if (tarea.grilla_id === nuevaGrillaId) return;

                // Obtener todas las tareas de la grilla destino ordenadas por posición
                const tareasEnNuevaGrilla = tareas
                    .filter(t => t.grilla_id === nuevaGrillaId && t.id !== tareaId)
                    .sort((a, b) => (a.position || 0) - (b.position || 0));
                
                // La nueva posición será al final
                const nuevaPosicion = tareasEnNuevaGrilla.length + 1;

                // Actualizar todas las tareas
                const nuevasTareas = tareas.map(t => {
                    if (t.id === tareaId) {
                        // Mover la tarea a la nueva grilla
                        return {
                            ...t,
                            grilla_id: nuevaGrillaId,
                            position: nuevaPosicion,
                            updated_at: new Date().toISOString(),
                        };
                    }
                    // Reordenar posiciones en la grilla origen (si la tarea venía de otra grilla)
                    if (t.grilla_id === tarea.grilla_id && t.id !== tareaId) {
                        const tareasEnGrillaOrigen = tareas
                            .filter(ta => ta.grilla_id === tarea.grilla_id && ta.id !== tareaId)
                            .sort((a, b) => (a.position || 0) - (b.position || 0));
                        const nuevaPos = tareasEnGrillaOrigen.findIndex(ta => ta.id === t.id);
                        if (nuevaPos !== -1) {
                            return {
                                ...t,
                                position: nuevaPos + 1,
                                updated_at: new Date().toISOString(),
                            };
                        }
                    }
                    return t;
                });

                onUpdateTareas(nuevasTareas);
                return;
            }

            // Si se está reordenando sobre otra tarea
            if (overId.startsWith('tarea-')) {
                const overTareaId = parseInt(overId.replace('tarea-', ''));
                const overTarea = tareas.find(t => t.id === overTareaId);
                
                if (!overTarea) return;

                // Si están en la misma grilla, reordenar (la tarea movida toma el lugar de la otra)
                if (tarea.grilla_id === overTarea.grilla_id) {
                    // Obtener todas las tareas de esta grilla ordenadas por posición
                    const tareasEnGrilla = tareas
                        .filter(t => t.grilla_id === tarea.grilla_id)
                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                    
                    const oldIndex = tareasEnGrilla.findIndex(t => t.id === tareaId);
                    const newIndex = tareasEnGrilla.findIndex(t => t.id === overTareaId);

                    // Validar índices
                    if (oldIndex === -1 || newIndex === -1) return;
                    
                    // Si es la misma posición, no hacer nada
                    if (oldIndex === newIndex) return;

                    // Usar arrayMove para reordenar: la tarea en oldIndex se mueve a newIndex
                    const tareasReordenadas = arrayMove(tareasEnGrilla, oldIndex, newIndex);

                    // Actualizar todas las tareas de esta grilla con las nuevas posiciones
                    const nuevasTareas = tareas.map(t => {
                        if (t.grilla_id === tarea.grilla_id) {
                            const nuevaPos = tareasReordenadas.findIndex(ta => ta.id === t.id);
                            if (nuevaPos !== -1) {
                                return {
                                    ...t,
                                    position: nuevaPos + 1,
                                    updated_at: new Date().toISOString(),
                                };
                            }
                        }
                        return t;
                    });

                    onUpdateTareas(nuevasTareas);
                    return;
                }

                // Si están en grillas diferentes, mover a la grilla de la tarea sobre la que se soltó
                const nuevaGrillaId = overTarea.grilla_id;
                
                // Obtener todas las tareas de la grilla destino ordenadas por posición
                const tareasEnNuevaGrilla = tareas
                    .filter(t => t.grilla_id === nuevaGrillaId && t.id !== tareaId)
                    .sort((a, b) => (a.position || 0) - (b.position || 0));
                
                // Encontrar la posición de inserción (donde está la tarea sobre la que se soltó)
                const posicionDestino = tareasEnNuevaGrilla.findIndex(t => t.id === overTareaId);
                const nuevaPosicion = posicionDestino !== -1 ? posicionDestino + 1 : tareasEnNuevaGrilla.length + 1;

                // Crear nuevo array con la tarea movida
                const nuevasTareasEnGrilla = [...tareasEnNuevaGrilla];
                nuevasTareasEnGrilla.splice(posicionDestino !== -1 ? posicionDestino : nuevasTareasEnGrilla.length, 0, {
                    ...tarea,
                    grilla_id: nuevaGrillaId,
                    position: nuevaPosicion,
                    updated_at: new Date().toISOString(),
                });

                // Actualizar todas las tareas
                const nuevasTareas = tareas.map(t => {
                    if (t.id === tareaId) {
                        // La tarea movida
                        return {
                            ...t,
                            grilla_id: nuevaGrillaId,
                            position: nuevaPosicion,
                            updated_at: new Date().toISOString(),
                        };
                    }
                    // Reordenar posiciones en la grilla destino
                    if (t.grilla_id === nuevaGrillaId && t.id !== tareaId) {
                        const nuevaPos = nuevasTareasEnGrilla.findIndex(ta => ta.id === t.id);
                        if (nuevaPos !== -1) {
                            return {
                                ...t,
                                position: nuevaPos + 1,
                                updated_at: new Date().toISOString(),
                            };
                        }
                    }
                    // Reordenar posiciones en la grilla origen
                    if (t.grilla_id === tarea.grilla_id && t.id !== tareaId) {
                        const tareasEnGrillaOrigen = tareas
                            .filter(ta => ta.grilla_id === tarea.grilla_id && ta.id !== tareaId)
                            .sort((a, b) => (a.position || 0) - (b.position || 0));
                        const nuevaPos = tareasEnGrillaOrigen.findIndex(ta => ta.id === t.id);
                        if (nuevaPos !== -1) {
                            return {
                                ...t,
                                position: nuevaPos + 1,
                                updated_at: new Date().toISOString(),
                            };
                        }
                    }
                    return t;
                });

                onUpdateTareas(nuevasTareas);
            }
        }
    };

    const handleDeleteGrilla = (grillaId: number) => {
        const grillasFiltradas = grillas
            .filter(g => g.id !== grillaId)
            .map((item, index) => ({
                ...item,
                position: index + 1,
                updated_at: new Date().toISOString(),
            }));
        onUpdateGrillas(grillasFiltradas);
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div className="flex justify-between items-center mb-2 pb-2 border-b-2" style={{ borderColor: proyecto.color }}>
                <h2 className="text-xl font-bold" style={{ color: proyecto.color }}>
                    {proyecto.name}
                </h2>
                <ButtonAdd 
                    handleOpenModal={onOpenModalGrilla} 
                    buttonText="+ Grilla" 
                    colorButton="bg-green-500" 
                />
            </div>

            <div className="flex flex-row h-full w-full overflow-x-auto flex-1">
                <DndContext 
                    sensors={sensors}
                    collisionDetection={(args) => {
                        const activeId = String(args.active.id);
                        
                        // Para grillas, usar rectIntersection y filtrar solo otras grillas
                        if (activeId.startsWith('grilla-')) {
                            const collisions = rectIntersection(args);
                            // Solo devolver colisiones con otras grillas (no tareas ni droppables)
                            return collisions.filter(collision => {
                                const collisionId = String(collision.id);
                                return collisionId.startsWith('grilla-') && 
                                       collisionId !== activeId;
                            });
                        }
                        
                        // Para tareas, usar una estrategia híbrida
                        // Primero buscar colisiones con tareas usando closestCenter
                        const collisions = closestCenter(args);
                        const tareaCollisions = collisions.filter(c => 
                            String(c.id).startsWith('tarea-')
                        );
                        
                        // Si hay colisión con otra tarea, darle prioridad sobre droppables
                        if (tareaCollisions.length > 0) {
                            return tareaCollisions;
                        }
                        
                        // Si no hay tareas, buscar droppables usando rectIntersection (mejor para áreas grandes)
                        // Esto es especialmente importante para grillas vacías
                        const droppableCollisions = rectIntersection({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(container => {
                                const id = String(container.id);
                                return id.startsWith('droppable-grilla-') || id.startsWith('droppable-tareas-grilla-');
                            }),
                        });
                        
                        // Si hay colisiones con droppables, usarlas (prioridad para droppable-tareas-grilla)
                        if (droppableCollisions.length > 0) {
                            // Priorizar droppable-tareas-grilla sobre droppable-grilla
                            const tareasDroppable = droppableCollisions.filter(c => 
                                String(c.id).startsWith('droppable-tareas-grilla-')
                            );
                            if (tareasDroppable.length > 0) {
                                return tareasDroppable;
                            }
                            return droppableCollisions;
                        }
                        
                        // También buscar droppables en las colisiones normales
                        const droppableInCollisions = collisions.filter(c => {
                            const id = String(c.id);
                            return id.startsWith('droppable-grilla-') || id.startsWith('droppable-tareas-grilla-');
                        });
                        
                        if (droppableInCollisions.length > 0) {
                            // Priorizar droppable-tareas-grilla
                            const tareasDroppable = droppableInCollisions.filter(c => 
                                String(c.id).startsWith('droppable-tareas-grilla-')
                            );
                            if (tareasDroppable.length > 0) {
                                return tareasDroppable;
                            }
                            return droppableInCollisions;
                        }
                        
                        // Si no, devolver todas las colisiones
                        return collisions;
                    }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {grillas.length > 0 ? (
                        <SortableContext 
                            items={grillas.map(g => `grilla-${g.id}`)} 
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex flex-row gap-2 w-full h-full">
                                {grillas.map((grilla) => {
                                    const tareasDeGrilla = tareas
                                        .filter(t => t.grilla_id === grilla.id)
                                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                                    const tareaItems = tareasDeGrilla.map(t => `tarea-${t.id}`);
                                    // SortableContext puede funcionar con arrays vacíos, pero necesitamos asegurarnos de que siempre se renderice
                                    return (
                                        <SortableContext 
                                            key={grilla.id}
                                            items={tareaItems} 
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <Grillas 
                                                grilla={grilla} 
                                                onDelete={handleDeleteGrilla}
                                                handleOpenModal={() => onOpenModalTarea(grilla.id)}
                                                tareas={tareas}
                                                onUpdateTareas={onUpdateTareas}
                                            />
                                        </SortableContext>
                                    );
                                })}
                            </div>
                        </SortableContext>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <p className="text-gray-500">No hay grillas. Haz clic en el botón para agregar una.</p>
                        </div>
                    )}
                    <DragOverlay>
                        {activeId ? (
                            activeId.startsWith('grilla-') ? (
                                (() => {
                                    const grillaId = parseInt(activeId.replace('grilla-', ''));
                                    const grilla = grillas.find(g => g.id === grillaId);
                                    if (!grilla) return null;
                                    const tareasDeGrilla = tareas.filter(t => t.grilla_id === grilla.id);
                                    return (
                                        <div className="flex-1 min-w-[250px] max-w-[350px] py-1" style={{ height: '400px' }}>
                                            <div
                                                className="border-4 border-spacing-y-96 border-gray-300 rounded-lg h-full flex flex-col items-start p-3 relative shadow-2xl rotate-2"
                                                style={{ backgroundColor: grilla.color }}
                                            >
                                                <div className="w-full mb-2 pt-2">
                                                    <h2 className="text-lg font-semibold text-gray-800 text-center mb-1">
                                                        {grilla.name}
                                                    </h2>
                                                    <div className="text-xs text-gray-600 text-center">
                                                        {tareasDeGrilla.length} {tareasDeGrilla.length === 1 ? 'tarea' : 'tareas'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : activeId.startsWith('tarea-') ? (
                                (() => {
                                    const tareaId = parseInt(activeId.replace('tarea-', ''));
                                    const tarea = tareas.find(t => t.id === tareaId);
                                    if (!tarea) return null;
                                    return (
                                        <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-2xl rotate-2" style={{ width: '200px' }}>
                                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{tarea.title}</h3>
                                            {tarea.description && (
                                                <p className="text-xs text-gray-600 mb-1 line-clamp-2">{tarea.description}</p>
                                            )}
                                            {tarea.priority && (
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    tarea.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                                    tarea.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {tarea.priority}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()
                            ) : null
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}

