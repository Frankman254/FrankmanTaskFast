import type { Proyecto } from "@frankman-task-fast/types";
import { useState } from "react";

interface FormNewProyectProps {
	onAdd: (proyecto: Proyecto) => void;
	onClose: () => void;
	initialValue?: Proyecto | null;
	submitLabel?: string;
}

export default function FormNewProyect({
	onAdd,
	onClose,
	initialValue,
	submitLabel = 'Crear Proyecto',
}: FormNewProyectProps) {
	const [proyecto, setProyecto] = useState<Proyecto>(
		initialValue ?? {
			id: Date.now(),
			name: '',
			description: '',
			owner_id: 1,
			color: '#3b82f6',
			is_archived: false,
		}
	);
	const [error, setError] = useState('');

	const projectName = proyecto.name.trim();
	const isSubmitDisabled = projectName.length === 0;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitDisabled) {
			setError('El nombre del proyecto es obligatorio.');
			return;
		}

		onAdd({
			...proyecto,
			name: projectName,
			description: proyecto.description.trim(),
			created_at: proyecto.created_at ?? new Date().toISOString(),
			updated_at: new Date().toISOString(),
		});
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="project-name"
				>
					Nombre del proyecto
				</label>
				<input
					id="project-name"
					name="name"
					type="text"
					placeholder="Mi proyecto..."
					value={proyecto.name}
					onChange={(e) => {
						setProyecto({ ...proyecto, name: e.target.value });
						setError('');
					}}
					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
					autoFocus
				/>
			</div>

			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="project-description"
				>
					Descripcion
				</label>
				<input
					id="project-description"
					name="description"
					type="text"
					placeholder="Describe tu proyecto..."
					value={proyecto.description}
					onChange={(e) => setProyecto({ ...proyecto, description: e.target.value })}
					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="project-color"
				>
					Color
				</label>
				<div className="flex items-center gap-3">
					<input
						id="project-color"
						name="color"
						type="color"
						value={proyecto.color}
						onChange={(e) => setProyecto({ ...proyecto, color: e.target.value })}
						className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
					/>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						{proyecto.color}
					</span>
				</div>
			</div>

			{error && (
				<p className="text-xs text-red-600 dark:text-red-400 font-medium">
					{error}
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
					{submitLabel}
				</button>
			</div>
		</form>
	);
}
