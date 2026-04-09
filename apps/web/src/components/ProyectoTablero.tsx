import ButtonAdd from "./ButtonAdd";
import Grillas from "./Grillas";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, pointerWithin, rectIntersection } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, CollisionDetection } from "@dnd-kit/core";
import type { Grilla, Proyecto, Tarea } from "@frankman-task-fast/types";
import { useState, useCallback } from "react";
import { moveTaskOverTask, moveTaskToGridEnd, reorderGrillas } from "@/lib/board-dnd";

interface ProyectoTableroProps {
    proyecto: Proyecto;
    grillas: Grilla[];
    onUpdateGrillas: (grillas: Grilla[]) => void;
    className?: string;
    tareas: Tarea[];
    onUpdateTareas: (tareas: Tarea[]) => void;
    onOpenModalTarea: (grillaId: number) => void;
    onOpenModalGrilla: () => void;
}

export default function ProyectoTablero({ 
    proyecto, 
    grillas, 
    onUpdateGrillas,
    className = '',
    tareas,
    onUpdateTareas,
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

    // Custom collision detection that properly handles empty grids
    const collisionDetection: CollisionDetection = useCallback((args) => {
        const dragId = String(args.active.id);
        
        // For grillas: only collide with other grillas
        if (dragId.startsWith('grilla-')) {
            return rectIntersection({
                ...args,
                droppableContainers: args.droppableContainers.filter(container => {
                    const id = String(container.id);
                    return id.startsWith('grilla-') && id !== dragId;
                }),
            });
        }
        
        // For tareas: use pointerWithin which checks what the pointer is actually inside of
        // This is the KEY fix - closestCenter could match tasks from OTHER grids
        const allCollisions = pointerWithin(args);
        
        // 1. Check if pointer is over a tarea
        const tareaCollisions = allCollisions.filter(c => 
            String(c.id).startsWith('tarea-')
        );
        if (tareaCollisions.length > 0) {
            return tareaCollisions;
        }
        
        // 2. Check if pointer is over a droppable area (grid task area or grid itself)
        const droppableCollisions = allCollisions.filter(c => {
            const id = String(c.id);
            return id.startsWith('droppable-tareas-grilla-') || id.startsWith('droppable-grilla-');
        });
        
        // Prioritize the task area droppable over the general grid droppable
        const taskAreaDroppable = droppableCollisions.filter(c => 
            String(c.id).startsWith('droppable-tareas-grilla-')
        );
        if (taskAreaDroppable.length > 0) {
            return taskAreaDroppable;
        }
        
        if (droppableCollisions.length > 0) {
            return droppableCollisions;
        }
        
        // 3. Fallback: use rectIntersection for droppables only (catches edge cases)
        const fallbackCollisions = rectIntersection({
            ...args,
            droppableContainers: args.droppableContainers.filter(container => {
                const id = String(container.id);
                return id.startsWith('droppable-tareas-grilla-') || id.startsWith('droppable-grilla-');
            }),
        });
        
        return fallbackCollisions;
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (!over) return;

        const activeIdStr = String(active.id);
        const overId = String(over.id);

        // Grilla reordering
        if (activeIdStr.startsWith('grilla-') && overId.startsWith('grilla-')) {
            const activeGrillaId = parseInt(activeIdStr.replace('grilla-', ''));
            const overGrillaId = parseInt(overId.replace('grilla-', ''));
            const grillasActualizadas = reorderGrillas(grillas, activeGrillaId, overGrillaId);

            if (grillasActualizadas) {
                onUpdateGrillas(grillasActualizadas.map((grilla) => ({
                    ...grilla,
                    updated_at: new Date().toISOString(),
                })));
            }
            return;
        }

        // Task movement
        if (activeIdStr.startsWith('tarea-')) {
            const tareaId = parseInt(activeIdStr.replace('tarea-', ''));
            const tarea = tareas.find(t => t.id === tareaId);
            
            if (!tarea) return;

            // Dropped on a droppable area (grid)
            if (overId.startsWith('droppable-grilla-') || overId.startsWith('droppable-tareas-grilla-')) {
                const nuevaGrillaId = parseInt(
                    overId.replace('droppable-tareas-grilla-', '').replace('droppable-grilla-', '')
                );
                const nuevasTareas = moveTaskToGridEnd(tareas, tareaId, nuevaGrillaId);

                if (nuevasTareas) {
                    onUpdateTareas(nuevasTareas.map((item) => ({
                        ...item,
                        updated_at: new Date().toISOString(),
                    })));
                }
                return;
            }

            // Dropped on another task
            if (overId.startsWith('tarea-')) {
                const overTareaId = parseInt(overId.replace('tarea-', ''));
                const nuevasTareas = moveTaskOverTask(tareas, tareaId, overTareaId);

                if (nuevasTareas) {
                    onUpdateTareas(nuevasTareas.map((item) => ({
                        ...item,
                        updated_at: new Date().toISOString(),
                    })));
                }
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

    // Find active element for drag overlay
    const activeGrilla = activeId?.startsWith('grilla-')
        ? grillas.find(g => g.id === parseInt(activeId.replace('grilla-', '')))
        : null;
    const activeTarea = activeId?.startsWith('tarea-')
        ? tareas.find(t => t.id === parseInt(activeId.replace('tarea-', '')))
        : null;

    return (
        <div className={`flex flex-col h-full ${className}`}>
            <div className="flex justify-between items-center mb-3 pb-3 border-b-2" style={{ borderColor: proyecto.color }}>
                <h2 className="text-xl font-bold" style={{ color: proyecto.color }}>
                    {proyecto.name}
                </h2>
                <ButtonAdd 
                    handleOpenModal={onOpenModalGrilla} 
                    buttonText="+ Grilla" 
                    colorButton="bg-green-500" 
                />
            </div>

            <div className="flex flex-row h-full w-full overflow-x-auto flex-1 gap-3 pb-2">
                <DndContext 
                    sensors={sensors}
                    collisionDetection={collisionDetection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {grillas.length > 0 ? (
                        <SortableContext 
                            items={grillas.map(g => `grilla-${g.id}`)} 
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex flex-row gap-3 w-full h-full">
                                {grillas.map((grilla) => {
                                    const tareasDeGrilla = tareas
                                        .filter(t => t.grilla_id === grilla.id)
                                        .sort((a, b) => (a.position || 0) - (b.position || 0));
                                    const tareaItems = tareasDeGrilla.map(t => `tarea-${t.id}`);
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
                                            />
                                        </SortableContext>
                                    );
                                })}
                            </div>
                        </SortableContext>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay grillas. Haz clic en el botón para agregar una.
                            </p>
                        </div>
                    )}
                    <DragOverlay>
                        {activeGrilla ? (
                            <div className="flex-1 min-w-[260px] max-w-[320px] py-1" style={{ height: '400px' }}>
                                <div
                                    className="border-2 border-white/30 rounded-xl h-full flex flex-col items-start p-4 shadow-2xl rotate-2 backdrop-blur-sm"
                                    style={{ backgroundColor: activeGrilla.color }}
                                >
                                    <div className="w-full mb-2 pt-2">
                                        <h2 className="text-lg font-semibold text-white text-center mb-1">
                                            {activeGrilla.name}
                                        </h2>
                                        <div className="text-xs text-white/70 text-center">
                                            {tareas.filter(t => t.grilla_id === activeGrilla.id).length} tareas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTarea ? (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-2xl rotate-2 w-[220px]">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{activeTarea.title}</h3>
                                {activeTarea.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">{activeTarea.description}</p>
                                )}
                                {activeTarea.priority && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        activeTarea.priority === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        activeTarea.priority === 'Media' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                        {activeTarea.priority}
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
