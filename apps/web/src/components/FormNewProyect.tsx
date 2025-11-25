import type { Proyecto } from "@/types/models";

interface FormNewProyectProps {
    className?: string;
    onAdd: (proyecto: Proyecto) => void;
}
import { useState } from "react";
export default function FormNewProyect({ className = '', onAdd }: FormNewProyectProps) {
    const [proyecto, setProyecto] = useState<Proyecto>({
        id: Date.now(),
        name: '',
        description: '',
        owner_id: 0,
        color: '#3b82f6', // Color azul por defecto
        is_archived: false,
    });
    const handleAddProyecto = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!proyecto.name.trim()) {
            return; // No agregar si no hay nombre
        }
        onAdd({
            ...proyecto,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        // Resetear el formulario
        setProyecto({
            id: Date.now(),
            name: '',
            description: '',
            owner_id: 0,
            color: '#3b82f6',
            is_archived: false,
        });
    };
    return (
        <>
            <form onSubmit={handleAddProyecto} className={`shadow-md border-4 border-spacing-y-96 border-gray-200 rounded-lg bg-gray-100 h-full w-1/4 flex flex-col justify-start pt-4 px-4 gap-2 ${className}`}>
                <h2 className="text-lg font-semibold">Nuevo Proyecto</h2>
                <label className="text-sm font-semibold" htmlFor="name">Nombre</label>
                <input name="name" type="text" value={proyecto.name} onChange={(e) => setProyecto({ ...proyecto, name: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="description">Descripción</label>
                <input name="description" type="text" value={proyecto.description} onChange={(e) => setProyecto({ ...proyecto, description: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="owner_id">Propietario</label>
                <input name="owner_id" type="text" value={proyecto.owner_id} onChange={(e) => setProyecto({ ...proyecto, owner_id: parseInt(e.target.value) })} />
                <label className="text-sm font-semibold" htmlFor="color">Color</label>
                <input name="color" type="color" value={proyecto.color} onChange={(e) => setProyecto({ ...proyecto, color: e.target.value })} />
                <label className="text-sm font-semibold" htmlFor="is_archived">Archivado</label>
                <input name="is_archived" type="checkbox" checked={proyecto.is_archived} onChange={(e) => setProyecto({ ...proyecto, is_archived: e.target.checked })} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">Agregar Proyecto</button>
            </form>
        </>
    );
}