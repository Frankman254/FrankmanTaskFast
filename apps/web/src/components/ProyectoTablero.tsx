import type { DragEndEvent, DragStartEvent, CollisionDetection } from "@dnd-kit/core";
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	horizontalListSortingStrategy,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Grilla, Proyecto, Tarea } from "@frankman-task-fast/types";
import { useCallback, useState } from "react";

import ButtonAdd from "./ButtonAdd";
import Grillas from "./Grillas";
import { moveTaskOverTask, moveTaskToGridEnd, reorderGrillas } from "@/lib/board-dnd";

interface ProyectoTableroProps {
	proyecto: Proyecto;
	grillas: Grilla[];
	onUpdateGrillas: (grillas: Grilla[]) => void;
	onUpdateGrilla: (
		grillaId: number,
		changes: Pick<Grilla, "name" | "color" | "tipo">
	) => void;
	onDeleteGrilla: (grillaId: number) => void;
	className?: string;
	tareas: Tarea[];
	onUpdateTareas: (tareas: Tarea[]) => void;
	onOpenModalTarea: (grillaId: number) => void;
	onOpenModalGrilla: () => void;
	onSelectTask: (tarea: Tarea) => void;
}

export default function ProyectoTablero({
	proyecto,
	grillas,
	onUpdateGrillas,
	onUpdateGrilla,
	onDeleteGrilla,
	className = "",
	tareas,
	onUpdateTareas,
	onOpenModalTarea,
	onOpenModalGrilla,
	onSelectTask,
}: ProyectoTableroProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const collisionDetection: CollisionDetection = useCallback((args) => {
		const dragId = String(args.active.id);

		if (dragId.startsWith("grilla-")) {
			return rectIntersection({
				...args,
				droppableContainers: args.droppableContainers.filter((container) => {
					const id = String(container.id);
					return id.startsWith("grilla-") && id !== dragId;
				}),
			});
		}

		const allCollisions = pointerWithin(args);
		const tareaCollisions = allCollisions.filter((collision) =>
			String(collision.id).startsWith("tarea-")
		);
		if (tareaCollisions.length > 0) {
			return tareaCollisions;
		}

		const droppableCollisions = allCollisions.filter((collision) => {
			const id = String(collision.id);
			return id.startsWith("droppable-tareas-grilla-") || id.startsWith("droppable-grilla-");
		});

		const taskAreaDroppable = droppableCollisions.filter((collision) =>
			String(collision.id).startsWith("droppable-tareas-grilla-")
		);
		if (taskAreaDroppable.length > 0) {
			return taskAreaDroppable;
		}

		if (droppableCollisions.length > 0) {
			return droppableCollisions;
		}

		return rectIntersection({
			...args,
			droppableContainers: args.droppableContainers.filter((container) => {
				const id = String(container.id);
				return id.startsWith("droppable-tareas-grilla-") || id.startsWith("droppable-grilla-");
			}),
		});
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

		if (activeIdStr.startsWith("grilla-") && overId.startsWith("grilla-")) {
			const activeGrillaId = parseInt(activeIdStr.replace("grilla-", ""));
			const overGrillaId = parseInt(overId.replace("grilla-", ""));
			const grillasActualizadas = reorderGrillas(grillas, activeGrillaId, overGrillaId);

			if (grillasActualizadas) {
				onUpdateGrillas(
					grillasActualizadas.map((grilla) => ({
						...grilla,
						updated_at: new Date().toISOString(),
					}))
				);
			}
			return;
		}

		if (!activeIdStr.startsWith("tarea-")) return;

		const tareaId = parseInt(activeIdStr.replace("tarea-", ""));
		const tarea = tareas.find((item) => item.id === tareaId);

		if (!tarea) return;

		if (
			overId.startsWith("droppable-grilla-") ||
			overId.startsWith("droppable-tareas-grilla-")
		) {
			const nuevaGrillaId = parseInt(
				overId.replace("droppable-tareas-grilla-", "").replace("droppable-grilla-", "")
			);
			const nuevasTareas = moveTaskToGridEnd(tareas, tareaId, nuevaGrillaId);

			if (nuevasTareas) {
				onUpdateTareas(
					nuevasTareas.map((item) => ({
						...item,
						updated_at: new Date().toISOString(),
					}))
				);
			}
			return;
		}

		if (overId.startsWith("tarea-")) {
			const overTareaId = parseInt(overId.replace("tarea-", ""));
			const nuevasTareas = moveTaskOverTask(tareas, tareaId, overTareaId);

			if (nuevasTareas) {
				onUpdateTareas(
					nuevasTareas.map((item) => ({
						...item,
						updated_at: new Date().toISOString(),
					}))
				);
			}
		}
	};

	const activeGrilla = activeId?.startsWith("grilla-")
		? grillas.find((grilla) => grilla.id === parseInt(activeId.replace("grilla-", "")))
		: null;
	const activeTarea = activeId?.startsWith("tarea-")
		? tareas.find((tarea) => tarea.id === parseInt(activeId.replace("tarea-", "")))
		: null;

	return (
		<div className={`flex min-h-[560px] flex-col ${className}`}>
			<div
				className="mb-3 flex items-center justify-between border-b pb-4"
				style={{ borderColor: `${proyecto.color}55` }}
			>
				<div>
					<p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-slate-400">
						Tablero operativo
					</p>
					<h2 className="text-xl font-bold" style={{ color: proyecto.color }}>
						{proyecto.name}
					</h2>
				</div>
				<ButtonAdd
					handleOpenModal={onOpenModalGrilla}
					buttonText="+ Grilla"
					colorButton="bg-green-500"
				/>
			</div>

			<div className="flex w-full flex-row gap-4 overflow-x-auto overflow-y-visible pb-4">
				<DndContext
					sensors={sensors}
					collisionDetection={collisionDetection}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					{grillas.length > 0 ? (
						<SortableContext
							items={grillas.map((grilla) => `grilla-${grilla.id}`)}
							strategy={horizontalListSortingStrategy}
						>
							<div className="flex w-full flex-row items-start gap-4">
								{grillas.map((grilla) => {
									const tareasDeGrilla = tareas
										.filter((tarea) => tarea.grilla_id === grilla.id)
										.sort((a, b) => (a.position || 0) - (b.position || 0));
									const tareaItems = tareasDeGrilla.map((tarea) => `tarea-${tarea.id}`);

									return (
										<SortableContext
											key={grilla.id}
											items={tareaItems}
											strategy={verticalListSortingStrategy}
										>
											<Grillas
												grilla={grilla}
												onDelete={onDeleteGrilla}
												onSave={onUpdateGrilla}
												handleOpenModal={() => onOpenModalTarea(grilla.id)}
												tareas={tareas}
												onSelectTask={onSelectTask}
											/>
										</SortableContext>
									);
								})}
							</div>
						</SortableContext>
					) : (
						<div className="flex w-full items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30">
							<p className="text-gray-500 dark:text-gray-400">
								No hay grillas. Haz clic en el boton para agregar una.
							</p>
						</div>
					)}
					<DragOverlay>
						{activeGrilla ? (
							<div className="min-w-[280px] max-w-[340px] flex-1 py-1" style={{ height: "420px" }}>
								<div
									className="flex h-full flex-col items-start rounded-[28px] border-2 border-white/20 p-4 shadow-2xl backdrop-blur-sm"
									style={{ backgroundColor: activeGrilla.color }}
								>
									<div className="mb-2 w-full pt-2">
										<h2 className="mb-1 text-center text-lg font-semibold text-white">
											{activeGrilla.name}
										</h2>
										<div className="text-center text-xs text-white/70">
											{tareas.filter((tarea) => tarea.grilla_id === activeGrilla.id).length} tareas
										</div>
									</div>
								</div>
							</div>
						) : activeTarea ? (
							<div className="w-[240px] rounded-[22px] border border-white/10 bg-white p-3 shadow-2xl dark:bg-gray-800">
								<h3 className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
									{activeTarea.title}
								</h3>
								{activeTarea.description && (
									<p className="mb-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
										{activeTarea.description}
									</p>
								)}
								{activeTarea.priority && (
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-medium ${
											activeTarea.priority === "Alta"
												? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
												: activeTarea.priority === "Media"
												? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
												: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
										}`}
									>
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
