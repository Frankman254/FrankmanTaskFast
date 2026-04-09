import type { Grilla, Tarea } from "@frankman-task-fast/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { PencilLine } from "lucide-react";

import ButtonDeleteGrilla from "./ButtonDeleteGrilla";
import ButtonAdd from "./ButtonAdd";
import TareaComponent from "./Tarea";

interface GrillasProps {
	grilla: Grilla;
	className?: string;
	onDelete: (id: number) => void;
	onEdit: (grilla: Grilla) => void;
	handleOpenModal: () => void;
	tareas: Tarea[];
	onSelectTask: (tarea: Tarea) => void;
}

export default function Grillas({
	grilla,
	className = '',
	onDelete,
	onEdit,
	handleOpenModal,
	tareas,
	onSelectTask,
}: GrillasProps) {
	const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } =
		useSortable({
			id: `grilla-${grilla.id}`,
			disabled: false,
		});

	const { setNodeRef: setDroppableRef, isOver: isOverGrid } = useDroppable({
		id: `droppable-grilla-${grilla.id}`,
	});

	const { setNodeRef: setDroppableTareasRef, isOver: isOverTareas } = useDroppable({
		id: `droppable-tareas-grilla-${grilla.id}`,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? undefined : transition,
		opacity: isDragging ? 0.3 : 1,
		zIndex: isDragging ? 50 : 1,
	};

	const tareasDeEstaGrilla = tareas
		.filter((tarea) => tarea.grilla_id === grilla.id)
		.sort((a, b) => (a.position || 0) - (b.position || 0));

	const isDropTarget = isOverGrid || isOverTareas;

	return (
		<div
			ref={(node) => {
				setSortableRef(node);
				setDroppableRef(node);
			}}
			style={style}
			{...attributes}
			{...listeners}
			className={`flex-1 min-w-[280px] max-w-[340px] py-1 min-h-[560px] cursor-grab active:cursor-grabbing ${className}`}
		>
			<div
				className={`rounded-[26px] min-h-[560px] flex flex-col p-3.5 relative transition-all duration-200 ${
					isDropTarget ? 'ring-2 ring-cyan-300 ring-offset-2 dark:ring-offset-gray-950 scale-[1.01]' : ''
				} ${isDragging ? 'shadow-2xl' : 'shadow-[0_20px_50px_rgba(15,23,42,0.35)]'}`}
				style={{ backgroundColor: grilla.color }}
			>
				<div className="w-full mb-3 pt-1">
					<div className="flex items-start justify-between gap-3">
						<div>
							<p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">
								{grilla.tipo}
							</p>
							<h2 className="text-base font-bold text-white mb-0.5 drop-shadow-sm">
								{grilla.name}
							</h2>
							<div className="text-xs text-white/70 font-medium">
								{tareasDeEstaGrilla.length} {tareasDeEstaGrilla.length === 1 ? 'tarea' : 'tareas'}
							</div>
						</div>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onEdit(grilla);
							}}
							onPointerDown={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}
							className="shrink-0 rounded-full bg-white/15 hover:bg-white/25 text-white p-2 transition-colors"
							title="Editar grilla"
						>
							<PencilLine className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>

				<div
					ref={setDroppableTareasRef}
					className={`flex-1 w-full overflow-y-auto overflow-x-hidden pr-1 rounded-[18px] transition-all duration-200 ${
						isOverTareas ? 'bg-white/20 ring-2 ring-white/40 ring-inset' : ''
					} ${isOverGrid && !isOverTareas ? 'bg-white/10' : ''}`}
					style={{
						maxHeight: 'calc(100% - 104px)',
						minHeight: '140px',
					}}
					onPointerDown={(e) => {
						const target = e.target as HTMLElement;
						if (target.closest('[data-sortable-tarea]') || target.closest('button')) {
							e.stopPropagation();
						}
					}}
				>
					{tareasDeEstaGrilla.length > 0 ? (
						tareasDeEstaGrilla.map((tarea) => (
							<div key={tarea.id} data-sortable-tarea="true">
								<TareaComponent
									tarea={tarea}
									isDone={grilla.tipo === 'done'}
									onSelect={onSelectTask}
								/>
							</div>
						))
					) : (
						<div
							className="text-center text-white/60 text-xs py-4 h-full flex items-center justify-center rounded-[18px] border-2 border-dashed border-white/20 transition-all duration-200"
							style={{ minHeight: '140px' }}
						>
							{isDropTarget ? (
								<span className="text-white font-semibold text-sm animate-pulse">
									Suelta aqui
								</span>
							) : (
								<span>Sin tareas por ahora</span>
							)}
						</div>
					)}
				</div>

				<div
					className="mt-2 flex gap-2 justify-end"
					onClick={(e) => e.stopPropagation()}
					onPointerDown={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
					onMouseDown={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
					onTouchStart={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
					style={{ pointerEvents: 'auto' }}
				>
					<ButtonAdd
						handleOpenModal={handleOpenModal}
						buttonText="+ Tarea"
						colorButton="bg-white/20 hover:bg-white/30"
						className="text-xs px-3 py-1.5 text-white"
					/>
					<ButtonDeleteGrilla onDelete={onDelete} grilla={grilla} />
				</div>
			</div>
		</div>
	);
}
