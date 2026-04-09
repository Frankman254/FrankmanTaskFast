import type { Grilla, Tarea } from '@frankman-task-fast/types';
import { CalendarDays, CircleAlert, PencilLine, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import FormAddTarea from './FormAddTarea';

interface TaskInspectorProps {
	tarea: Tarea;
	grilla?: Grilla;
	onClose: () => void;
	onSave: (tarea: Tarea) => void;
	onDelete: (tareaId: number) => void;
}

const getDeadlineState = (tarea: Tarea) => {
	if (!tarea.due_date) {
		return null;
	}

	const today = new Date().toISOString().split('T')[0];
	if (tarea.due_date < today) {
		return 'overdue';
	}

	if (tarea.due_date === today) {
		return 'today';
	}

	return 'upcoming';
};

export default function TaskInspector({
	tarea,
	grilla,
	onClose,
	onSave,
	onDelete,
}: TaskInspectorProps) {
	const [isEditing, setIsEditing] = useState(false);
	const deadlineState = getDeadlineState(tarea);

	return (
		<aside className="h-full rounded-[28px] border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
				<div>
					<p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/80">
						Detalle de tarea
					</p>
					<h3 className="text-lg font-semibold text-white mt-1">{tarea.title}</h3>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="w-9 h-9 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
				>
					<X className="w-4 h-4 mx-auto" />
				</button>
			</div>

			<div className="px-5 py-4 space-y-4 overflow-y-auto h-[calc(100%-73px)]">
				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-2xl bg-white/5 border border-white/10 p-3">
						<p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Columna</p>
						<p className="text-sm font-semibold text-white mt-2">{grilla?.name ?? 'Sin columna'}</p>
					</div>
					<div className="rounded-2xl bg-white/5 border border-white/10 p-3">
						<p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Prioridad</p>
						<p className="text-sm font-semibold text-white mt-2">{tarea.priority}</p>
					</div>
				</div>

				<div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
					<div className="flex items-center gap-2 text-slate-200">
						<CalendarDays className="w-4 h-4 text-cyan-300" />
						<span className="text-sm font-medium">Fechas</span>
					</div>
					<div className="text-sm text-slate-300 space-y-1">
						<p>Inicio: {tarea.start_date || 'Sin fecha'}</p>
						<p>Limite: {tarea.due_date || 'Sin fecha'}</p>
					</div>
					{deadlineState && (
						<div
							className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
								deadlineState === 'overdue'
									? 'bg-red-500/20 text-red-200'
									: deadlineState === 'today'
									? 'bg-amber-400/20 text-amber-100'
									: 'bg-cyan-400/20 text-cyan-100'
							}`}
						>
							<CircleAlert className="w-3.5 h-3.5" />
							{deadlineState === 'overdue'
								? 'Vencida'
								: deadlineState === 'today'
								? 'Vence hoy'
								: 'Programada'}
						</div>
					)}
				</div>

				{!isEditing ? (
					<>
						<div className="rounded-2xl bg-white/5 border border-white/10 p-4">
							<p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3">
								Descripcion
							</p>
							<p className="text-sm leading-6 text-slate-200">
								{tarea.description || 'Sin descripcion todavia.'}
							</p>
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="flex-1 rounded-2xl bg-cyan-400/20 border border-cyan-300/30 text-cyan-100 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
							>
								<PencilLine className="w-4 h-4" />
								Editar tarea
							</button>
							<button
								type="button"
								onClick={() => onDelete(tarea.id)}
								className="rounded-2xl bg-red-500/15 border border-red-300/20 text-red-100 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
							>
								<Trash2 className="w-4 h-4" />
								Borrar
							</button>
						</div>
					</>
				) : (
					<div className="rounded-2xl bg-white p-4 text-slate-900">
						<FormAddTarea
							initialValue={tarea}
							submitLabel="Guardar cambios"
							onAdd={(updatedTask) => {
								onSave(updatedTask);
								setIsEditing(false);
							}}
							onClose={() => setIsEditing(false)}
						/>
					</div>
				)}
			</div>
		</aside>
	);
}
