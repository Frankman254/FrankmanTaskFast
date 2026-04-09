import type { Grilla } from "@frankman-task-fast/types";
import { useState } from "react";

interface FormNewGrillaProps {
    onAdd: (grilla: Grilla) => void;
    onClose: () => void;
}

export default function FormNewGrilla({ onAdd, onClose }: FormNewGrillaProps) {
	const [grilla, setGrilla] = useState<Grilla>({
		id: Date.now(),
		name: '',
		color: '#6366f1',
		position: 0,
		proyect_id: 0,
		tipo: 'custom',
	});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!grilla.name.trim()) return;
		onAdd({
			id: Date.now(),
			name: grilla.name,
			color: grilla.color,
			position: grilla.position,
			proyect_id: grilla.proyect_id,
			tipo: grilla.tipo,
		});
        onClose();
    };

    // Preset colors for quick selection
    const presetColors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
        '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b',
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="grilla-name">
                    Nombre de la grilla
                </label>
                <input
                    id="grilla-name"
                    name="name"
                    type="text"
                    placeholder="Ej: Por hacer, En progreso..."
                    value={grilla.name}
                    onChange={(e) => setGrilla({ ...grilla, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    autoFocus
                />
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
                                grilla.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110' : 'hover:scale-105'
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
                    <span className="text-xs text-gray-500 dark:text-gray-400">Color personalizado</span>
                </div>
            </div>

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
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors cursor-pointer shadow-sm"
                >
                    Crear Grilla
                </button>
            </div>
        </form>
    );
}
