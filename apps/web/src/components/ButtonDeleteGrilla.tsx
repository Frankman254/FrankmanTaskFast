import type { Grilla } from "../types/models";

export default function ButtonDeleteGrilla({ onDelete, grilla }: { onDelete: (id: number) => void, grilla: Grilla }) {
    return (
        <button 
        className="text-gray-600 hover:text-red-600 text-sm px-2 py-1 bg-white rounded shadow-sm cursor-pointer"
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.(grilla.id);
        }}
        onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}
        onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}
        onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}
        type="button"
    >
        Borrar
    </button>
    );
}