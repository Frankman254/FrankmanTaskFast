interface FormAddTareaProps {
    className?: string;
    onAdd: (tarea: Tarea) => void;
}
import { useState } from "react";
import type { Tarea } from "../types/models";
export default function FormAddTarea({ className = '', onAdd }: FormAddTareaProps) {
    const [tarea, setTarea] = useState<Tarea>({
        id: Date.now(),
        grilla_id: 0,
        title: '',
        description: '',
        position: 0,
        assigned_to: 0,
        start_date: '',
        due_date: '',
        priority: '',
        created_by: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const handleAddTarea = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tarea.title.trim()) {
            return; // No agregar si no hay nombre
        }
        onAdd({
            ...tarea,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        // Resetear el formulario
        setTarea({
            id: Date.now(),
            grilla_id: 0,
            title: '',
            description: '',
            position: 0,
            assigned_to: 0,
            start_date: '',
            due_date: '',
            priority: '',
            created_by: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    };
    return (
        <>
            <form onSubmit={handleAddTarea} className={`shadow-md border-4 border-spacing-y-96 border-gray-200 rounded-lg bg-gray-100 h-full w-1/4 flex flex-col justify-start pt-4 px-4 gap-2 ${className}`}>
                <h2 className="text-lg font-semibold">Nueva Tarea</h2>
                <label className="text-sm font-semibold" htmlFor="title">Titulo</label>
                <input name="title" type="text" value={tarea.title} onChange={(e) => setTarea({ ...tarea, title: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="description">Descripción</label>
                <input name="description" type="text" value={tarea.description} onChange={(e) => setTarea({ ...tarea, description: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="assigned_to">Asignado a</label>
                <input name="assigned_to" type="text" value={tarea.assigned_to} onChange={(e) => setTarea({ ...tarea, assigned_to: parseInt(e.target.value) })} />
                <label className="text-sm font-semibold" htmlFor="priority">Prioridad</label>
                <input name="priority" type="text" value={tarea.priority} onChange={(e) => setTarea({ ...tarea, priority: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="created_by">Creado por</label>
                <input name="created_by" type="text" value={tarea.created_by} onChange={(e) => setTarea({ ...tarea, created_by: parseInt(e.target.value) })} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">Agregar Tarea</button>
            </form>
        </>
    );
}