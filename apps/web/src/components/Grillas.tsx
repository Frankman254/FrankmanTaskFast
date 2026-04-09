import type { Grilla, Tarea } from "@frankman-task-fast/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import ButtonDeleteGrilla from "./ButtonDeleteGrilla";
import ButtonAdd from "./ButtonAdd";
import TareaComponent from "./Tarea";

interface GrillasProps {
	grilla: Grilla;
	className?: string;
	onDelete: (id: number) => void;
	handleOpenModal: () => void;
	tareas: Tarea[];
}

export default function Grillas({
	grilla,
	className = '',
	onDelete,
	handleOpenModal,
	tareas,
}: GrillasProps) {
	// Sortable for the grid container (drag to reorder grids)
	const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } =
		useSortable({ 
			id: `grilla-${grilla.id}`,
			disabled: false,
		});

	// Droppable for the entire grid (fallback drop target)
	const { setNodeRef: setDroppableRef, isOver: isOverGrid } = useDroppable({
		id: `droppable-grilla-${grilla.id}`,
	});

	// Droppable specifically for the task area (primary drop target)
	const { setNodeRef: setDroppableTareasRef, isOver: isOverTareas } = useDroppable({
		id: `droppable-tareas-grilla-${grilla.id}`,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? undefined : transition,
		opacity: isDragging ? 0.3 : 1,
		zIndex: isDragging ? 50 : 1,
	};

	// Filter and sort tasks for this grid
	const tareasDeEstaGrilla = tareas
		.filter(t => t.grilla_id === grilla.id)
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
			className={`flex-1 min-w-[260px] max-w-[320px] py-1 h-full cursor-grab active:cursor-grabbing ${className}`}
		>
			<div
				className={`rounded-xl h-full flex flex-col p-3 relative transition-all duration-200 ${
					isDropTarget ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900 scale-[1.02]' : ''
				} ${isDragging ? 'shadow-2xl' : 'shadow-md'}`}
				style={{ backgroundColor: grilla.color }}
			>
				{/* Grid header */}
				<div className="w-full mb-3 pt-1">
					<h2 className="text-base font-bold text-white text-center mb-0.5 drop-shadow-sm">
						{grilla.name}
					</h2>
					<div className="text-xs text-white/70 text-center font-medium">
						{tareasDeEstaGrilla.length} {tareasDeEstaGrilla.length === 1 ? 'tarea' : 'tareas'}
					</div>
				</div>

				{/* Tasks area - scrollable and droppable */}
				<div 
					ref={setDroppableTareasRef}
					className={`flex-1 w-full overflow-y-auto overflow-x-hidden pr-1 rounded-lg transition-all duration-200 ${
						isOverTareas ? 'bg-white/20 ring-2 ring-white/40 ring-inset' : ''
					} ${isOverGrid && !isOverTareas ? 'bg-white/10' : ''}`}
					style={{ 
						maxHeight: 'calc(100% - 100px)',
						minHeight: '120px',
					}}
					onPointerDown={(e) => {
						// Prevent task interactions from triggering grid drag
						const target = e.target as HTMLElement;
						if (target.closest('[data-sortable-tarea]') || target.closest('button')) {
							e.stopPropagation();
						}
					}}
				>
					{tareasDeEstaGrilla.length > 0 ? (
						tareasDeEstaGrilla.map((tarea) => (
							<div key={tarea.id} data-sortable-tarea="true">
								<TareaComponent tarea={tarea} />
							</div>
						))
					) : (
						<div 
							className="text-center text-white/50 text-xs py-4 h-full flex items-center justify-center rounded-lg border-2 border-dashed border-white/20 transition-all duration-200"
							style={{ minHeight: '120px' }}
						>
							{isDropTarget ? (
								<span className="text-white font-semibold text-sm animate-pulse">
									↓ Suelta aquí
								</span>
							) : (
								<span>Sin tareas</span>
							)}
						</div>
					)}
				</div>

				{/* Buttons - not draggable */}
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
					<ButtonAdd handleOpenModal={handleOpenModal} buttonText="+ Tarea" colorButton="bg-white/20 hover:bg-white/30" className="text-xs px-3 py-1.5 text-white" />
					<ButtonDeleteGrilla onDelete={onDelete} grilla={grilla} />
				</div>
			</div>
		</div>
	);
}
