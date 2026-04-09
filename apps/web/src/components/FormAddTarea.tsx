import { useState } from "react";
import type { PrioridadTarea, Tarea } from "@frankman-task-fast/types";

interface FormAddTareaProps {
	onAdd: (tarea: Tarea) => void;
	onClose: () => void;
}

const today = new Date().toISOString().split('T')[0];

export default function FormAddTarea({ onAdd, onClose }: FormAddTareaProps) {
	const [tarea, setTarea] = useState<Tarea>({
		id: Date.now(),
		grilla_id: 0,
		title: '',
		description: '',
		position: 0,
		assigned_to: 1,
		start_date: today,
		due_date: '',
		priority: 'Media',
		created_by: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});
	const [error, setError] = useState('');

	const priorities: { value: PrioridadTarea; label: string; color: string }[] = [
		{
			value: 'Alta',
			label: 'Alta',
			color:
				'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
		},
		{
			value: 'Media',
			label: 'Media',
			color:
				'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
		},
		{
			value: 'Baja',
			label: 'Baja',
			color:
				'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
		},
	];

	const trimmedTitle = tarea.title.trim();
	const hasInvalidDateRange =
		Boolean(tarea.start_date) &&
		Boolean(tarea.due_date) &&
		tarea.due_date < tarea.start_date;
	const isSubmitDisabled = trimmedTitle.length === 0 || hasInvalidDateRange;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (trimmedTitle.length === 0) {
			setError('El titulo de la tarea es obligatorio.');
			return;
		}
		if (hasInvalidDateRange) {
			setError('La fecha limite no puede ser anterior a la fecha de inicio.');
			return;
		}

		onAdd({
			...tarea,
			title: trimmedTitle,
			description: tarea.description.trim(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="tarea-title"
				>
					Titulo
				</label>
				<input
					id="tarea-title"
					name="title"
					type="text"
					placeholder="Que necesitas hacer?"
					value={tarea.title}
					onChange={(e) => {
						setTarea({ ...tarea, title: e.target.value });
						setError('');
					}}
					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
					autoFocus
				/>
			</div>

			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="tarea-description"
				>
					Descripcion
				</label>
				<textarea
					id="tarea-description"
					name="description"
					placeholder="Detalles de la tarea..."
					value={tarea.description}
					onChange={(e) => setTarea({ ...tarea, description: e.target.value })}
					rows={3}
					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Prioridad
				</label>
				<div className="flex gap-2">
					{priorities.map((priority) => (
						<button
							key={priority.value}
							type="button"
							onClick={() => setTarea({ ...tarea, priority: priority.value })}
							className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority.color} ${
								tarea.priority === priority.value
									? 'ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-900 scale-105'
									: 'opacity-60 hover:opacity-100'
							}`}
						>
							{priority.label}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						htmlFor="tarea-start"
					>
						Fecha inicio
					</label>
					<input
						id="tarea-start"
						type="date"
						value={tarea.start_date}
						onChange={(e) => {
							setTarea({ ...tarea, start_date: e.target.value });
							setError('');
						}}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
				<div>
					<label
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						htmlFor="tarea-due"
					>
						Fecha limite
					</label>
					<input
						id="tarea-due"
						type="date"
						value={tarea.due_date}
						min={tarea.start_date || undefined}
						onChange={(e) => {
							setTarea({ ...tarea, due_date: e.target.value });
							setError('');
						}}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
			</div>

			{(error || hasInvalidDateRange) && (
				<p className="text-xs text-red-600 dark:text-red-400 font-medium">
					{error || 'La fecha limite no puede ser anterior a la fecha de inicio.'}
				</p>
			)}

			<div className="flex gap-3 pt-2">
				<button
					type="button"
					onClick={onClose}
					className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
				>
					Cancelar
				</button>
				<button
					type="submit"
					disabled={isSubmitDisabled}
					className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer shadow-sm"
				>
					Crear Tarea
				</button>
			</div>
		</form>
	);
}
