import type { Grilla, TipoGrilla } from "@frankman-task-fast/types";
import { useState } from "react";

interface FormNewGrillaProps {
	onAdd: (grilla: Grilla) => void;
	onClose: () => void;
	initialValue?: Grilla | null;
	submitLabel?: string;
}

const tiposGrilla: { value: TipoGrilla; label: string }[] = [
	{ value: 'todo', label: 'Por hacer' },
	{ value: 'doing', label: 'En curso' },
	{ value: 'done', label: 'Hecho' },
	{ value: 'custom', label: 'Custom' },
];

export default function FormNewGrilla({
	onAdd,
	onClose,
	initialValue,
	submitLabel = 'Crear Grilla',
}: FormNewGrillaProps) {
	const [grilla, setGrilla] = useState<Grilla>(
		initialValue ?? {
			id: Date.now(),
			name: '',
			color: '#6366f1',
			position: 0,
			proyect_id: 0,
			tipo: 'custom',
		}
	);
	const [error, setError] = useState('');

	const gridName = grilla.name.trim();
	const isSubmitDisabled = gridName.length === 0;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitDisabled) {
			setError('El nombre de la grilla es obligatorio.');
			return;
		}

		onAdd({
			...grilla,
			name: gridName,
		});
		onClose();
	};

	const presetColors = [
		'#ef4444',
		'#f97316',
		'#eab308',
		'#22c55e',
		'#06b6d4',
		'#3b82f6',
		'#6366f1',
		'#8b5cf6',
		'#ec4899',
		'#64748b',
	];

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div>
				<label
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					htmlFor="grilla-name"
				>
					Nombre de la grilla
				</label>
				<input
					id="grilla-name"
					name="name"
					type="text"
					placeholder="Ej: Por hacer, En progreso..."
					value={grilla.name}
					onChange={(e) => {
						setGrilla({ ...grilla, name: e.target.value });
						setError('');
					}}
					className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
					autoFocus
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Tipo de grilla
				</label>
				<div className="grid grid-cols-2 gap-2">
					{tiposGrilla.map((tipo) => (
						<button
							key={tipo.value}
							type="button"
							onClick={() => setGrilla({ ...grilla, tipo: tipo.value })}
							className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
								grilla.tipo === tipo.value
									? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
									: 'border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'
							}`}
						>
							{tipo.label}
						</button>
					))}
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Color
				</label>
				<div className="flex flex-wrap gap-2 mb-3">
					{presetColors.map((color) => (
						<button
							key={color}
							type="button"
							onClick={() => setGrilla({ ...grilla, color })}
							className={`w-8 h-8 rounded-lg transition-all cursor-pointer ${
								grilla.color === color
									? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110'
									: 'hover:scale-105'
							}`}
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
				<div className="flex items-center gap-3">
					<input
						name="color"
						type="color"
						value={grilla.color}
						onChange={(e) => setGrilla({ ...grilla, color: e.target.value })}
						className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
					/>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						Color personalizado
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
