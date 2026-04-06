import { useState } from "react";
import type { Tarea } from "../types/models";

interface FormAddTareaProps {
    onAdd: (tarea: Tarea) => void;
    onClose: () => void;
}

export default function FormAddTarea({ onAdd, onClose }: FormAddTareaProps) {
    const [tarea, setTarea] = useState<Tarea>({
        id: Date.now(),
        grilla_id: 0,
        title: '',
        description: '',
        position: 0,
        assigned_to: 0,
        start_date: new Date().toISOString(),
        due_date: '',
        priority: 'Media',
        created_by: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tarea.title.trim()) return;
        onAdd({
            ...tarea,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        onClose();
    };

    const priorities = [
        { value: 'Alta', label: 'Alta', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' },
        { value: 'Media', label: 'Media', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
        { value: 'Baja', label: 'Baja', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tarea-title">
                    Título
                </label>
                <input
                    id="tarea-title"
                    name="title"
                    type="text"
                    placeholder="¿Qué necesitas hacer?"
                    value={tarea.title}
                    onChange={(e) => setTarea({ ...tarea, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tarea-description">
                    Descripción
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
                    {priorities.map((p) => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => setTarea({ ...tarea, priority: p.value })}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${p.color} ${
                                tarea.priority === p.value 
                                    ? 'ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-900 scale-105' 
                                    : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tarea-start">
                        Fecha inicio
                    </label>
                    <input
                        id="tarea-start"
                        type="date"
                        value={tarea.start_date ? tarea.start_date.split('T')[0] : ''}
                        onChange={(e) => setTarea({ ...tarea, start_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="tarea-due">
                        Fecha límite
                    </label>
                    <input
                        id="tarea-due"
                        type="date"
                        value={tarea.due_date ? tarea.due_date.split('T')[0] : ''}
                        onChange={(e) => setTarea({ ...tarea, due_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
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
                    Crear Tarea
                </button>
            </div>
        </form>
    );
}