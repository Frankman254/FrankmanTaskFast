import type { Tarea } from "@frankman-task-fast/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, Eye } from "lucide-react";

interface TareaComponentProps {
	tarea: Tarea;
	isDone?: boolean;
	onSelect?: (tarea: Tarea) => void;
}

const getDeadlineState = (tarea: Tarea, isDone: boolean) => {
	if (isDone || !tarea.due_date) return null;
	const today = new Date().toISOString().split('T')[0];

	if (tarea.due_date < today) return 'overdue';
	if (tarea.due_date === today) return 'today';
	return 'upcoming';
};

export default function TareaComponent({
	tarea,
	isDone = false,
	onSelect,
}: TareaComponentProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: `tarea-${tarea.id}` });
	const deadlineState = getDeadlineState(tarea, isDone);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => onSelect?.(tarea)}
			className={`bg-white/95 dark:bg-gray-900/90 border rounded-[20px] p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 ${
				isDragging ? 'shadow-xl ring-2 ring-blue-400 border-blue-300/60' : 'border-white/10'
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
					{tarea.title}
				</h3>
				<button
					type="button"
					onPointerDown={(e) => e.stopPropagation()}
					onClick={(e) => {
						e.stopPropagation();
						onSelect?.(tarea);
					}}
					className="shrink-0 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-300 p-1.5 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
					title="Ver detalle"
				>
					<Eye className="w-3.5 h-3.5" />
				</button>
			</div>
			{tarea.description && (
				<p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
					{tarea.description}
				</p>
			)}
			<div className="flex items-center justify-between gap-3 flex-wrap">
				{tarea.priority && (
					<span
						className={`text-xs px-2 py-0.5 rounded-full font-medium ${
							tarea.priority === 'Alta'
								? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
								: tarea.priority === 'Media'
								? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
								: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
						}`}
					>
						{tarea.priority}
					</span>
				)}
				{tarea.due_date && (
					<span
						className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-semibold ${
							deadlineState === 'overdue'
								? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
								: deadlineState === 'today'
								? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
								: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
						}`}
					>
						<CalendarClock className="w-3 h-3" />
						{deadlineState === 'overdue'
							? `Vencida ${tarea.due_date}`
							: deadlineState === 'today'
							? 'Vence hoy'
							: tarea.due_date}
					</span>
				)}
			</div>
		</div>
	);
}
