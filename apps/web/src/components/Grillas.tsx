import type { Grilla, Tarea } from "../types/models";
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
	onUpdateTareas: (tareas: Tarea[]) => void;
}

export default function Grillas({
	grilla,
	className = '',
	onDelete,
	handleOpenModal,
	tareas,
	onUpdateTareas,
}: GrillasProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ 
			id: `grilla-${grilla.id}`,
			disabled: false,
		});

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
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

	// Filtrar y ordenar tareas de esta grilla por posición
	const tareasDeEstaGrilla = tareas
		.filter(t => t.grilla_id === grilla.id)
		.sort((a, b) => (a.position || 0) - (b.position || 0));

	// Combinar refs para sortable y droppable principal
	const combinedRef = (node: HTMLDivElement | null) => {
		setNodeRef(node);
		setDroppableRef(node);
	};

	return (
		<div
			ref={combinedRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`flex-1 min-w-[250px] max-w-[350px] py-1 h-full cursor-grab active:cursor-grabbing ${className}`}
		>
			<div
				className={`border-4 border-spacing-y-96 border-gray-300 rounded-lg h-full flex flex-col items-start p-3 relative ${
					(isOver || isOverTareas) ? 'ring-2 ring-blue-500' : ''
				} ${isDragging ? 'shadow-2xl' : ''}`}
				style={{ backgroundColor: grilla.color }}
				onPointerDown={(e) => {
					// Prevenir que las tareas activen el drag de la grilla
					const target = e.target as HTMLElement;
					if (target.closest('[data-sortable-tarea]') || target.closest('button')) {
						e.stopPropagation();
					}
				}}
			>
				{/* Header de la grilla */}
				<div className="w-full mb-2 pt-2">
					<h2 className="text-lg font-semibold text-gray-800 text-center mb-1">
						{grilla.name}
					</h2>
					<div className="text-xs text-gray-600 text-center">
						{tareasDeEstaGrilla.length} {tareasDeEstaGrilla.length === 1 ? 'tarea' : 'tareas'}
					</div>
				</div>

				{/* Área de tareas - scrollable y droppable */}
				<div 
					ref={setDroppableTareasRef}
					className={`flex-1 w-full overflow-y-auto overflow-x-hidden pr-1 min-h-[100px] ${
						isOverTareas ? 'ring-2 ring-blue-500 ring-inset bg-blue-100 bg-opacity-50' : ''
					} ${isOver && !isOverTareas ? 'ring-2 ring-blue-400' : ''}`}
					style={{ 
						maxHeight: 'calc(100% - 100px)',
						minHeight: '150px', // Asegurar altura mínima para mejor detección
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
							className="text-center text-gray-500 text-xs py-4 h-full flex items-center justify-center"
							style={{ minHeight: '150px' }}
						>
							{isOverTareas || isOver ? (
								<span className="text-blue-600 font-semibold">Suelta la tarea aquí</span>
							) : (
								'No hay tareas'
							)}
						</div>
					)}
				</div>

				{/* Botones - no arrastrables */}
				<div 
					className="absolute bottom-2 right-2 z-30 flex gap-2"
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
					<ButtonAdd handleOpenModal={handleOpenModal} buttonText="+ Tarea" colorButton="bg-green-500" className="text-xs px-2 py-1" />
					<ButtonDeleteGrilla onDelete={onDelete} grilla={grilla} />
				</div>
			</div>
		</div>
	);
}

