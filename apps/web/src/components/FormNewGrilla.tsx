interface FormNewGrillaProps {
    className?: string;
    onAdd: (grilla: Grilla) => void;
}
import type { Grilla } from "../types/models";
import { useState } from "react";

export default function FormNewGrilla({ className = '', onAdd }: FormNewGrillaProps) {
    const [grilla, setGrilla] = useState<Grilla>({
        id: Date.now(), // Temporary ID, will be replaced by backend
        name: '',
        color: '#df1515ff',
        proyect_id: 0,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;// se refiere a los atributos del input
        setGrilla({ ...grilla, [name]: type === 'number' ? parseInt(value) : value });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // ← CRÍTICO: evita reload de página

        // Llamar a la función del padre que actualiza el array
        onAdd({
            id: Date.now(), // Generate unique temporary ID
            name: grilla.name,
            color: grilla.color,
            proyect_id: grilla.proyect_id,
        });
    };
    return (
        // <div className="border-4 border-dashed border-gray-200 rounded-lg h-full flex items-center justify-center">
        <form onSubmit={handleSubmit} className={`shadow-md border-4 border-spacing-y-96 border-gray-200 rounded-lg bg-gray-100 h-full w-1/4 flex flex-col justify-start pt-4 px-4 gap-2 ${className}`}>
            <h2 className="text-lg font-semibold">Nueva Grilla</h2>
            <p>Introduzca los datos de la grilla</p>
            <label className="text-sm font-semibold" htmlFor="name">Nombre</label>
            <input
                name="name"
                type="text"
                placeholder="Nombre de la grilla"
                value={grilla.name}
                onChange={handleChange}
            />
            {/* <label htmlFor="position">Posicion</label> */}
            {/* <input
                name="position"
                type="number"
                placeholder="Posicion de la grilla"
                value={grilla.position}
                onChange={handleChange}
            /> */}
            <label className="text-sm font-semibold" htmlFor="color">Color</label>
            <input
                name="color"
                type="color"
                placeholder="Color de la grilla"
                value={grilla.color}
                onChange={handleChange}
            />
            <label className="text-sm font-semibold" htmlFor="proyect_id">Proyecto</label>
            <input
                name="proyect_id"
                type="number"
                placeholder="Proyecto de la grilla"
                value={grilla.proyect_id}
                onChange={handleChange}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">Agregar Grilla</button>
        </form>

    );
}